var _ = require('underscore'),
    Backbone = require('backbone');

var Flow = Backbone.Model.extend({
    addStep: function (callback) {
        this._chain[this._chain.length] = callback;
        return this;
    },

    nextFrom: function (index, data) {
        this._currentStep = index - 1;
        this.next(data);
    },

    repeat: function (data) {
        if (!_.isUndefined(this._chain[this._currentStep])) {
            var me = this;
            process.nextTick(function() {
                me._chain[me._currentStep](me, data);
            });
        }
    },

    next: function (data) {
        if (!_.isUndefined(this._chain[this._currentStep + 1])) {
            this._currentStep += 1;
            var me = this;
            process.nextTick(function() {
                me._chain[me._currentStep](me, data);
            });
        }
    },

    last: function(data) {
        if(this._chain.length > 1 && this._chain.length - 1 != this._currentStep) {
            this._currentStep = this._chain.length - 2;
            this.next(data);
        } else {
            this.next(data);
        }
    },

    getStep: function () {
        return this._currentStep;
    },

    execute: function (data) {
        if (_.isUndefined(data)) {
            data = null;
        }
        this._currentStep = -1;
        this.next(data);
    }
});

var FlowsManager = function () {
    return {
        _flows: new Backbone.Collection(),
        create: function () {
            var flow = new Flow();
            flow._storage = new Backbone.Collection();
            flow._chain = [];
            flow._currentStep = 0;
            this._flows.add({
                id: flow.id,
                flow: flow
            });
            return flow;
        },
        destroy: function (flow) {
            var models = this._flows.where({id: flow.id});
            if (models.length > 0) {
                this._flows.remove(models);
            }
        }
    };
};

module.exports = new FlowsManager();