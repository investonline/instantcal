import React, { Component, PropTypes } from 'react';
import RemainingTime from '../RemainingTime';
import Event from '../Event';
import cx from 'classnames';

export default class CalendarNextEvents extends Component {

    static propTypes = {
        currentEvent: PropTypes.object,
        nextEvents: PropTypes.array,
    };

    render() {
        const currentEvent = this.props.currentEvent;
        const nextEvents = this.props.nextEvents;

        if (!nextEvents || !nextEvents.length) {
            return <div className="no-events">
                <div>{"Salle libre"}</div>
            </div>
        }

        const nextEvent = nextEvents[0];
        let startDate = nextEvent.startDate;
        let startTime = startDate.getTime();
        let timeRemaining = startTime - Date.now();

        const eventList = [];
        let lastDay;
        const today = new Date();

        nextEvents.forEach((nextEvent, index) => {
            let startDate = new Date(nextEvent.startDate);
            const currentDay = `${startDate.getFullYear()}_${startDate.getMonth()}_${startDate.getDate()}`;
            //if (lastDay != currentDay) {
            //    if (startDate.getFullYear() != today.getFullYear()
            //            || startDate.getMonth() != today.getMonth()
            //            || startDate.getDate() != today.getDate()) {
            //        eventList.push(
            //            <li key={ 'date' + startDate.getTime() } className="day">{`${startDate.getDate()}/${startDate.getMonth()+1}/${startDate.getFullYear()}`}</li>
            //        );
            //    }
            //    lastDay = currentDay;
            //}

            eventList.push(
                <li key={ 'nextEvent' + index } className="event">
                    <Event event={nextEvent} currentEvent={false} />
                </li>
            )
        });
        const currentEventClassname = cx('current-event', {
            ['has-next-events'] : nextEvents,
            ['no-events']: nextEvents === undefined,
        });
        return <div className="events">
            <div className={currentEventClassname}>
                <Event event={currentEvent} currentEvent={true} />
            </div>
            <div className="next-events">
                <ul className="event-list">
                    {eventList}
                </ul>
            </div>
        </div>

    }
}
