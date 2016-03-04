import render from '../renderHtml';
import IndexPage from '../../components/IndexPage';
import { getByNameOrSlug, getAllRoomsExcept } from '../rooms';
import { webSocketPort } from '../webSocket';

export default async function action(ctx) {
    const roomNames = decodeURI(ctx.path).trim().replace(/^\/+/, '').split(',');
    const rooms = roomNames.map(roomName => {
        const room = getByNameOrSlug(roomName);
        ctx.assert(room, 404, `room ${roomName} not found`);
        return room;
    });

    const otherRooms = getAllRoomsExcept(roomNames);

    ctx.body = render({
        Component: IndexPage,
        data: { rooms, otherRooms },
        htmlData: {
            hostname: ctx.hostname,
            webSocketPort,
            rooms,
            otherRooms,
        }
    });
}
