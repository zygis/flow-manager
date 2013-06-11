# Flow-manager for node

<a href="https://travis-ci.org/zygis/flow-manager" target="blank"><img src="https://api.travis-ci.org/zygis/flow-manager.png" alt="build status" /></a>

Small library to manage async functions and avoid "callback hell"

## Another (async|steps|flow|etc) library?

Well... Yes. But this one is dead simple. Simple library - less overhead and less bugs.

## Install

```
npm install flow-manager
```

## How it works

Create "Flow" object and add some steps. "Step" is a simple callback with two arguments: flow object and data object.

```javascript
var Flows = require('flow-manager');

Flows
        .create();
        .addStep(function (flow, data) {
            // some awesome stuff
            data.step1 = 'done';
            flow.next(data);
        })
        .addStep(function (flow, data) {
            console.log(data); // {initialData: {isAwesome: true}, step1: true}

            // always destroy flow object at the end:
            Flows.destroy(flow);
            // OR if this is the last step, after .next() it will be destroyed automatically
            //flow.next();
            //
        })
        .execute({
            initialData: {isAwesome: true}
        });
```

## Catch errors

```javascript
var Flows = require('flow-manager');

Flows
        .create();
        .addStep(function (flow, data) {
            data.step1 = true;
            throw new Error('Oh!');
            flow.next(data);
        })
        .addStep(function (flow, data) {
            data.step2 = true;
            flow.next(data);
        })
        .addStep(function (flow, data) {
            console.log('All OK', data); // Expected: All OK {step1: true, step2: true}
            Flows.destroy(flow);
        })
        .catch(function (data) {
            console.log('Error', data);
        })
        .execute({
            step1: false,
            step2: false
        });

// Result:
// Error {step1: true, step2: false}
```

## Full control

* flow.next(<i>object</i>) - Goes to the next step. If <i>object</i> is provided - next step will receive it as a data
* flow.nextFrom(<i>int</i>, <i>object</i>) - Same as .next just another step will be used, <i>int</i> - step number
* flow.getStep() - receive current step number
* flow.repeat(<i>object</i>) - repeat current step
* flow.execute(<i>object</i>) - start flow, object holds data for first step, if <i>object</i> is not provided - then first step will receive <i>null</i>

## Real world example

Real world is much more complex, than examples, take a look: <a href="https://github.com/zygis/flow-manager/blob/master/test.js" target="_blank">test.js</a>
