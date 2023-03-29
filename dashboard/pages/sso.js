import { gql } from "@apollo/client";
import { Component } from "react";
import client from "../apollo-client-server";
import { setCookie} from 'cookies-next';
import ClipLoader from "react-spinners/PulseLoader";

const login = gql`
    mutation auth(
        $token: String!
    ){
        login(token: $token){
            token
        }
    }
`

class Page extends Component {

    render() {
        return (
            <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                <ClipLoader color={"#0e7490"} loading={true} size={10} height={10} width={10} />
            </div>
        )
    }
}

Page.getInitialProps = async (props) => {
    try {

        let { data, errors } = await client.query({
            query: login,
            variables: { token: props.query.code }
        });

        if (data.login) {
            setCookie('token', data.login.token, { req: props.req, res: props.res, maxAge: 3480, path: '/' });

            if (props.query.state.next) {
                props.res.writeHead(307, { Location: props.query.state.next })
                props.res.end()
            } else {
                props.res.writeHead(307, { Location: '/' })
                props.res.end()
            }
        }

        if (errors) {
            let error = errors[0]
            props.res.writeHead(307, { Location: '/login?error=' + error.message })
            props.res.end()
        }

    } catch (error) {
        props.res.writeHead(307, { Location: '/login?error=' + error.message })
        props.res.end()
    }

    return {}
}

export default Page