import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom/server';
//import Router from 'react-routing/src/Router';
import IndexPage from '../../components/IndexPage';
import Html from '../../components/Html';
import withContext from '../../decorators/withContext';
import { hasRoom, checkRoomBusy } from '../rooms';
import { webSocketPort } from '../webSocket'

@withContext
class App extends Component {
    static propTypes = {
        children: PropTypes.element.isRequired,
    };
    static contextTypes = {
        onInsertCss: PropTypes.func
    };


    render() {
        return this.props.children;
    }
}

const router = {
    dispatch({ context, isBusy }) {
        return {
            component: <App context={context}><IndexPage isBusy={isBusy} /></App>
        }
    }
};


export const route = '/:room';

export async function action(req, res, next) {
    try {
        const roomName = req.params.room;

        if (!hasRoom(roomName)) {
            res.end('room not found');
            return;
        }

        let statusCode = 200;
        const data = {title: '', description: '', css: '', body: ''};
        const css = [];
        const context = {
            onInsertCss: value => css.push(value),
            onSetTitle: value => data.title = value,
            onSetMeta: (key, value) => data[key] = value,
            onPageNotFound: () => statusCode = 404,
        };

        const isBusy = checkRoomBusy(roomName);
        const { state, component } = router.dispatch({ path: req.path, context, isBusy });
        data.body = ReactDOM.renderToString(component);
        data.css = css.join('');
        data.hostname = req.hostname;
        data.roomStatus = isBusy;
        data.webSocketPort = webSocketPort;
        const html = ReactDOM.renderToStaticMarkup(<Html {...data} />);
        res.status(statusCode).send('<!doctype html>\n' + html);
    } catch (err) {
        next(err);
    }
}
