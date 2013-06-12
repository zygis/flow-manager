var Flows = require('./index'),
    assert = require('assert'),
    Tests = {

        simpleFlow: function (flow, data) {
            Flows
                .create()
                .addStep(function (flow, data) {
                    assert.strictEqual(data.param, 1);
                    data.param += 1;
                    flow.next(data);
                })
                .addStep(function (flow, data) {
                    assert.strictEqual(data.param, 2);
                    data.param += 1;
                    flow.next(data);
                })
                .addStep(function (flow, data) {
                    assert.strictEqual(data.param, 3);
                    console.log('| ' + data.realFlowData.step + ' . Passed | Simple Flow');
                    data.realFlowData.step += 1;
                    data.realFlow.next(data.realFlowData);
                    flow.next();
                })
                .execute({
                    param: 1,
                    realFlow: flow,
                    realFlowData: data
                });
        },

        repeatStep: function (flow, data) {
            Flows
                .create()
                .addStep(function (flow, data) {
                    data.param += 1;
                    if (data.param < 3) {
                        flow.repeat(data);
                    } else {
                        flow.next(data);
                    }
                })
                .addStep(function (flow, data) {
                    assert.strictEqual(data.param, 3);
                    data.param += 1;
                    flow.next(data);
                })
                .addStep(function (flow, data) {
                    assert.strictEqual(data.param, 4);
                    console.log('| ' + data.realFlowData.step + ' . Passed | Repeat Step');
                    data.realFlowData.step += 1;
                    data.realFlow.next(data.realFlowData);
                    flow.next();
                })
                .execute({
                    param: 1,
                    realFlow: flow,
                    realFlowData: data
                });
        },

        skipStep: function (flow, data) {
            Flows
                .create()
                .addStep(function (flow, data) {
                    assert.strictEqual(data.param, 1);
                    flow.nextFrom(3, data);
                })
                .addStep(function (flow, data) {
                    data.param += 1;
                    flow.next(data);
                })
                .addStep(function (flow, data) {
                    assert.strictEqual(data.param, 1);
                    console.log('| ' + data.realFlowData.step + ' . Passed | Skip Step');
                    data.realFlowData.step += 1;
                    data.realFlow.next(data.realFlowData);
                    flow.next();
                })
                .execute({
                    param: 1,
                    realFlow: flow,
                    realFlowData: data
                });
        },

        getStep: function (flow, data) {
            Flows
                .create()
                .addStep(function (flow, data) {
                    assert.strictEqual(data.param, 1);
                    assert.strictEqual(flow.getStep(), 1);
                    flow.next(data);
                })
                .addStep(function (flow, data) {
                    assert.strictEqual(data.param, 1);
                    assert.strictEqual(flow.getStep(), 2);
                    flow.next(data);
                })
                .addStep(function (flow, data) {
                    assert.strictEqual(data.param, 1);
                    assert.strictEqual(flow.getStep(), 3);
                    console.log('| ' + data.realFlowData.step + ' . Passed | Get Step');
                    data.realFlowData.step += 1;
                    data.realFlow.next(data.realFlowData);
                    flow.next();
                })
                .execute({
                    param: 1,
                    realFlow: flow,
                    realFlowData: data
                });
        },

        catchError: function (flow, data) {
            Flows
                .create()
                .addStep(function (flow, data) {
                    assert.strictEqual(data.param, 1);
                    assert.strictEqual(flow.getStep(), 1);
                    data.param += 1;
                    flow.next(data);
                })
                .addStep(function (flow, data) {
                    throw new Error('ups!');
                    flow.next(data);
                })
                .addStep(function (flow, data) {
                    // empty
                })
                .catch(function (error, data) {
                    assert.strictEqual(data.param, 2);
                    assert.strictEqual(error.toString(), 'Error: ups!');
                    console.log('| ' + data.realFlowData.step + ' . Passed | Catch Error');
                    data.realFlowData.step += 1;
                    data.realFlow.next(data.realFlowData);
                })
                .execute({
                    param: 1,
                    realFlow: flow,
                    realFlowData: data
                });
        },

        throwError: function (flow, data) {
            Flows
                .create()
                .addStep(function (flow, data) {
                    assert.strictEqual(data.param, 1);
                    assert.strictEqual(flow.getStep(), 1);
                    data.param += 1;
                    flow.next(data);
                })
                .addStep(function (flow, data) {
                    setTimeout(function () {
                        setTimeout(function () {
                            setTimeout(function () {
                                flow.throwError('deep', data);
                                flow.next(data);
                            },0);
                        },0);
                    },0);
                })
                .addStep(function (flow, data) {
                    // empty
                })
                .catch(function (error, data) {
                    assert.strictEqual(data.param, 2);
                    assert.strictEqual(error.toString(), 'Error: deep');
                    console.log('| ' + data.realFlowData.step + ' . Passed | Throw Error');
                    data.realFlowData.step += 1;
                    data.realFlow.next(data.realFlowData);
                })
                .execute({
                    param: 1,
                    realFlow: flow,
                    realFlowData: data
                });
        }
    }

Flows
    .create()
    .addStep(function (flow) {
        console.log('------------------------------------');
        console.log('|              Testing             |');
        console.log('------------------------------------');

        flow.next({step : 1});
    })
    .addStep(Tests.simpleFlow)
    .addStep(Tests.repeatStep)
    .addStep(Tests.skipStep)
    .addStep(Tests.getStep)
    .addStep(Tests.catchError)
    .addStep(Tests.throwError)
    .addStep(function (flow) {
        console.log('------------------------------------');
        console.log('|          ALL TESTS PASSED        |');
        console.log('------------------------------------');
        flow.next();
    })
    .execute();


