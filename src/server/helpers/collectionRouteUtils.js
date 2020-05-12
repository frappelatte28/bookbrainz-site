import * as handler from '../helpers/handler';
import * as search from './search';
import _ from 'lodash';


export async function makeCollectionCreateOrEditHandler(req, res) {
	const {UserCollection, UserCollectionCollaborator} = req.app.locals.orm;
	const isNew = !res.locals.collection;
	let newCollection;
	let method;
	if (isNew) {
		newCollection = await new UserCollection({
			editorId: req.user.id
		});
		method = 'insert';
	}
	else {
		newCollection = await new UserCollection({id: req.params.collectionId}).fetch({
			require: true
		});
		method = 'update';
	}
	newCollection.set('description', req.body.description);
	newCollection.set('name', req.body.name);
	newCollection.set('public', req.body.privacy === 'Public');
	newCollection.set('type', req.body.type);
	await newCollection.save(null, {method});

	const oldCollaborators = res.locals.collection ? res.locals.collection.collaborators : [];
	const newCollaborators = req.body.collaborators ? req.body.collaborators : [];

	const newlyAddedCollaborators = _.differenceWith(newCollaborators, oldCollaborators, _.isEqual);
	const removedCollaborators = _.differenceWith(oldCollaborators, newCollaborators, _.isEqual);

	const collaboratorPromises = [];

	newlyAddedCollaborators.forEach((collaborator) => {
		collaboratorPromises.push(
			new UserCollectionCollaborator({
				collectionId: newCollection.get('id'),
				editorId: collaborator.id
			}).save(null, {method: 'insert'})
		);
	});
	removedCollaborators.forEach((collaborator) => {
		collaboratorPromises.push(
			new UserCollectionCollaborator({})
				.where('collection_id', newCollection.get('id'))
				.where('editor_id', collaborator.id)
				.destroy()
		);
	});

	await Promise.all(collaboratorPromises);

	// if the name is changed, we need to update this collection in ElasticSearch index
	if (isNew || res.locals.collection.name !== newCollection.get('name')) {
		const collectionPromiseForES = new Promise((resolve) => {
			const collectionForES = {
				aliasSet: {
					aliases: [
						{name: newCollection.get('name')}
					]
				},
				bbid: newCollection.get('id'),
				id: newCollection.get('id'),
				type: 'Collection'
			};
			resolve(collectionForES);
		});
		return 	handler.sendPromiseResult(res, collectionPromiseForES, search.indexEntity);
	}
	return res.send(newCollection.toJSON());
}
