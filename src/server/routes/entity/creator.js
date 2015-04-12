var express = require('express');
var auth = require('../../helpers/auth');
var Promise = require('bluebird');
var Creator = require('../../data/entities/creator');
var Gender = require('../../data/properties/gender');
var CreatorType = require('../../data/properties/creator-type');
var Language = require('../../data/properties/language');
var Entity = require('../../data/entity');
var renderRelationship = require('../../helpers/render');

var NotFoundError = require('../../helpers/error').NotFoundError;

var router = express.Router();

router.param('bbid', function(req, res, next, bbid) {
	if (/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/.test(bbid))
		next();
	else
		next('route');
});

router.get('/:bbid', function(req, res, next) {
	var render = function(creator) {
		var rendered = creator.relationships.map(function(relationship) {
			relationship.entities.sort(function sortRelationshipEntity(a, b) {
				return a.position - b.position;
			});

			relationship.entities = relationship.entities.map(function(entity) {
				return Entity.findOne(entity.entity.entity_gid);
			});

			relationship.template = relationship.relationship_type.template;
			relationship.rendered = Promise.all(relationship.entities)
				.then(function(entities) {
					entities.forEach(function(entity) {
						entity.entity_gid = entity.bbid;
					});
					return renderRelationship(entities, relationship, null);
				});

			return Promise.props(relationship);
		});

		Promise.all(rendered)
			.then(function(rendered) {
				var title = 'Creator';

				if (creator.default_alias && creator.default_alias.name)
					title = 'Creator “' + creator.default_alias.name + '”';

				creator.relationships = rendered;
				res.render('entity/view/creator', {
					title: title,
					entity: creator
				});
			});
	};

	Creator.findOne(req.params.bbid, {
			populate: [
				'annotation',
				'disambiguation',
				'relationships',
			]
		})
		.then(render)
		.catch(function(err) {
			if (err.status == 404) {
				var newErr = new NotFoundError('Creator not found');
				return next(newErr);
			}

			next(err);
		});
});

// Creation

router.get('/create', auth.isAuthenticated, function(req, res) {
	var gendersPromise = Gender.find();
	var creatorTypesPromise = CreatorType.find();
	var languagesPromise = Language.find();

	Promise.join(gendersPromise, creatorTypesPromise, languagesPromise,
		function(genders, creatorTypes, languages) {
			var genderList = genders.sort(function(a, b) {
				return a.id > b.id;
			});

			var alphabeticLanguagesList = languages.sort(function(a, b) {
				if (a.frequency != b.frequency)
					return b.frequency - a.frequency;

				return a.name.localeCompare(b.name);
			});

			res.render('entity/create/creator', {
				genders: genderList,
				languages: alphabeticLanguagesList,
				creatorTypes: creatorTypes,
				title: 'Add Creator'
			});
		});
});

router.post('/create/handler', auth.isAuthenticated, function(req, res) {
	var changes = {
		bbid: null,
		ended: req.body.ended
	};

	if (req.body.creatorTypeId) {
		changes.creator_type = {
			creator_type_id: req.body.creatorTypeId
		};
	}

	if (req.body.genderId) {
		changes.gender = {
			gender_id: req.body.genderId
		};
	}

	if (req.body.beginDate) {
		changes.begin_date = req.body.beginDate;
	}

	if (req.body.endDate) {
		changes.end_date = req.body.endDate;
	}

	if (req.body.disambiguation)
		changes.disambiguation = req.body.disambiguation;

	if (req.body.annotation)
		changes.annotation = req.body.annotation;

	if (req.body.note) {
		changes.revision = {
			note: req.body.note
		};
	}

	if (req.body.aliases.length) {
		var default_alias = req.body.aliases[0];

		changes.aliases = [{
			name: default_alias.name,
			sort_name: default_alias.sortName,
			language_id: default_alias.languageId,
			primary: default_alias.primary,
			default: true
		}];
	}

	Creator.create(changes, {
			session: req.session
		})
		.then(function(revision) {
			res.send(revision);
		});
});

module.exports = router;
