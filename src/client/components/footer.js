/*
 * Copyright (C) 2016  Daniel Hsing
 *               2016  Ben Ockmore
 *               2016  Sean Burke
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 */

import * as bootstrap from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import PropTypes from 'prop-types';
import React from 'react';


const {Col, Grid, Row} = bootstrap;

function Footer(props) {
	const {repositoryUrl, siteRevision} = props;

	return (
		<footer className="footer">
			<Grid fluid>
				<Row>
					<Col>
						<div className="margin-top-3">
							<h4 className="contact-text">
											Contact Us
							</h4>
							<div style={{
								alignItems: 'center',
								display: 'flex',
								justifyContent: 'center'
							}}
							>
								<FontAwesomeIcon
									className="margin-sides-1 contact-text"
									icon="circle"
								/>
								<a className="contact-text" href="//webchat.freenode.net/?channels=#metabrainz">
									<FontAwesomeIcon
										className="contact-text"
										icon="comment-dots"
										size="2x"
									/>
												IRC
								</a>
								<FontAwesomeIcon
									className="margin-sides-1 contact-text"
									icon="circle"
								/>
								<a className="contact-text" href="//community.metabrainz.org/c/bookbrainz">
									<FontAwesomeIcon
										className="contact-text"
										icon="comments"
										size="2x"
									/>
												Forums
								</a>
								<FontAwesomeIcon
									className="margin-sides-1 contact-text"
									icon="circle"
								/>
								<a className="contact-text" href="//twitter.com/intent/tweet?screen_name=BookBrainz">
									<FontAwesomeIcon
										className="contact-text"
										icon={['fab', 'twitter']}
										size="2x"
									/>
												Twitter
								</a>
								<FontAwesomeIcon
									className="margin-sides-1 contact-text"
									icon="circle"
								/>
								<a className="contact-text" href="mailto:bookbrainz@metabrainz.org">
									<FontAwesomeIcon
										className="contact-text"
										icon="envelope"
										size="2x"
									/>
												Email
								</a>
								<FontAwesomeIcon
									className="margin-sides-1 contact-text"
									icon="circle"
								/>
							</div>
						</div>
					</Col>

				</Row>
				<Row>
					<Col className="text-center" xs={4}>
						<small>Cover image by{' '}
							<a href="https://commons.wikimedia.org/wiki/File:Bookshelf.jpg">
								Stewart Butterfield
							</a> (
							<a href="https://creativecommons.org/licenses/by/2.0/deed.en">
								CC-BY-2.0
							</a>)
						</small>
					</Col>
					<Col className="text-right" xs={4}>
						<a href="/privacy">
							<small>Privacy & Terms</small>
						</a>
					</Col>
				</Row>
				<Row className="text-center">
					<small>
						Alpha Software —{' '}
						<a href={`${repositoryUrl}commit/${siteRevision}`}>
							{siteRevision}
						</a> —&nbsp;
						<a href="https://tickets.metabrainz.org/projects/BB/issues/">
							Report a Bug
						</a>
					</small>
				</Row>
			</Grid>
		</footer>
	);
}

Footer.displayName = 'Footer';
Footer.propTypes = {
	repositoryUrl: PropTypes.string.isRequired,
	siteRevision: PropTypes.string.isRequired
};

export default Footer;
