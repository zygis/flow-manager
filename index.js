var Flow = function () {
            this.id = 0;
            this._chain = [];
            this._catch = null;
            this._currentStep = 0;
    },
    flowIterator = 0,
    flowStorage = {};

Flow.prototype.addStep = function (callback) {
    this._chain[this._chain.length] = callback;
    return this;
};
Flow.prototype.catch = function (callback) {
    this._catch = callback;
    return this;
};
Flow.prototype.nextFrom = function (index, data) {
    this._currentStep = index - 2;
    this.next(data);
};
Flow.prototype.repeat = function (data) {
    if (typeof this._chain[this._currentStep] !== 'undefined') {
        var self = this;
        process.nextTick(function() {
            try {
                self._chain[self._currentStep](self, data);
            } catch (e) {
                if (self._catch === null) {
                    throw e;
                } else {
                    self._catch(e, data);
                }
                module.exports.destroy(self);
            }
        });
    }
};
Flow.prototype.next = function (data) {
    if (typeof this._chain[this._currentStep + 1] !== 'undefined') {
        this._currentStep += 1;
        var self = this;
        process.nextTick(function() {
            try {
                self._chain[self._currentStep](self, data);
            } catch (e) {
                if (self._catch === null) {
                    throw e;
                } else {
                    self._catch(e, data);
                }
                module.exports.destroy(self);
            }
        });
    } else {
        module.exports.destroy(this);
    }
};
Flow.prototype.getStep = function () {
    return this._currentStep + 1;
};
Flow.prototype.throwError = function (error, data) {
    var self = this;
    process.nextTick(function() {
        if (self._catch === null) {
            throw new Error(error.toString());
        } else {
            self._catch(new Error(error.toString()), data);
        }
        module.exports.destroy(self);
    });
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