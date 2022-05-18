'use strict'
export function NewSecundomer() {
    let TimeCreated = Date.now()
    return {
        Stopped: true,
        Date: TimeCreated,
        PassedTime: 0,
        GetTime: function () {
            return (!this.Stopped) ? this.PassedTime + Date.now() - this.TimeCreated : this.PassedTime;
        },
        StopTime: function () {
            this.PassedTime += (!this.Stopped) ? ((Date.now() - this.TimeCreated)) : 0;
            this.Stopped = true
        },
        Continue: function () {
            (this.Stopped) ? this.TimeCreated = Date.now() : this.Stopped = false;
            this.Stopped = false
        },
        Refresh: function () {
            this.PassedTime = 0
            this.Stopped = true
        },
        Start: function () {
            this.Continue()
        }
    }
}