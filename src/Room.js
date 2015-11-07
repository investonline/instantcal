function checkIsDifferent(event1, event2) {
    if (event1 && event2) {
        if (event1.id !== event2.id) {
            return true;
        }

        if (event1.startDate.getTime() !== event2.startDate.getTime()) {
            return true;
        }

        if (event1.endDate.getTime() !== event2.endDate.getTime()) {
            return true;
        }
    } else if (!(!event1 && !event2)) {
        return true;
    }

    return false;
}


export default class Room {
    constructor(name, calendarId) {
        this._name = name;
        this._calendarId = calendarId;
    }

    _updateEvents(events) {
        const _currentEvent = this._currentEvent, _nextEvent = this._nextEvent;
        if (!events.length) {
            this._busy = false;
            this._busySoon = false;
            this._currentEvent = null;
            this._nextEvent = null;
        } else {
            if (events[0].startDate.getTime() < Date.now()) {
                this._currentEvent = events[0];
                this._nextEvent = events[1];
                this._busy = true;
                this._busySoon = null;
            } else {
                this._currentEvent = null;
                this._nextEvent = events[0];
                this._busy = false;
                this._busySoon = this._nextEvent && this._nextEvent.startDate.getTime() < (Date.now() + 10000);
            }
        }

        if (checkIsDifferent(_currentEvent, this._currentEvent)) {
            return true;
        }

        if (checkIsDifferent(_nextEvent, this._nextEvent)) {
            return true;
        }

        return false;
    }

    _fromJson(json) {
        Object.assign(this, json);
    }

    _toJson() {
        return {
            _name: this._name,
            _busy: this._busy,
            _busySoon: this._busySoon,
            _currentEvent: this._currentEvent,
            _nextEvent: this._nextEvent,
        }
    }

    get name() {
        return this._name;
    }

    get calendarId() {
        return this._calendarId;
    }

    get currentEvent() {
        return this._currentEvent;
    }

    get nextEvent() {
        return this._currentEvent;
    }

    get isBusy() {
        return this._busy;
    }

    get isBusySoon() {
        return this._busySoon;
    }
}
