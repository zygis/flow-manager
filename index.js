var Flow = function () {
            this.id = 0;
            this._chain = [];
            this._currentStep = 0;
    },
    flowIterator = 0,
    flowStorage = {};

Flow.prototype.addStep = function (callback) {
    this._chain[this._chain.length] = callback;
    return this;
};
Flow.prototype.nextFrom = function (index, data) {
    this._currentStep = index - 1;
    this.next(data);
};
Flow.prototype.repeat = function (data) {
    if (typeof this._chain[this._currentStep] !== 'undefined') {
        var me = this;
        process.nextTick(function() {
            me._chain[me._currentStep](me, data);
        });
    }
};
Flow.prototype.next = function (data) {
    if (typeof this._chain[this._currentStep + 1] !== 'undefined') {
        this._currentStep += 1;
        var me = this;
        process.nextTick(function() {
            me._chain[me._currentStep](me, data);
        });
    } else {
        module.exports.destroy(this);
    }
};
Flow.prototype.execute = function(data) {
    if (typeof data === 'undefined') {
        data = null;
    }
    this._currentStep = -1;
    this.next(data);
};

module.exports = {
    create: function () {
        var iterator = ++flowIterator;
        flowStorage[iterator] = new Flow();
        flowStorage[iterator].id = iterator;
        return flowStorage[iterator];
    },
    destroy: function (flow) {
        if (typeof flowStorage[flow.id] !== 'undefined') {
            delete flowStorage[flow.id];
        }
    },
    size: function() {
        return Object.keys(flowStorage).length;
    }
};