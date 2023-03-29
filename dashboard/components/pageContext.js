import React from 'react';
import Router from 'next/router';
import client from "../apollo-client-server";
import { gql} from "@apollo/client";
import WrappedComponent from './pageContext';

const user_query = gql`
    query User{
        user{
            email
			secondaryEmail
            fullName
            picture
        }
    }
`

const checkuserentication = async (context) => {
	return new Promise(async (resolve, reject) =>{
		try{
			const { data } = await client.query({
				query: user_query,
				context: {
					headers: { authorization: context.req.cookies.token ? `JWT ` + context.req.cookies.token : '' }
				}
			});
			return resolve({ user: data.user })
		}catch(e){
			return reject(e)
		}
	})
	
};

export default WrappedComponent =>{
	
	const hocComponent = ({ ...props }) => <WrappedComponent {...props} />;

	hocComponent.getInitialProps = async (context) => {
		let user = await checkuserentication(context);
		let login = '/login?next='+encodeURIComponent(context.req.url)

		// Are you an authorized user or not?
		if (!user?.user) {
			// Handle server-side and client-side rendering.
			if (context.res) {
				context.res?.writeHead(302, {
					Location: login,
				});
				context.res?.end();
			} else {
				Router.replace(login);
			}
		} else if (WrappedComponent.getInitialProps) {
			const wrappedProps = await WrappedComponent.getInitialProps({ ...context, user: user.user });
			return { ...wrappedProps, user: user.user };
		}

		return { user: user.user };
	};

	return hocComponent;
};