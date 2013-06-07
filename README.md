# Flow-manager for node

<a href="https://travis-ci.org/zygis/flow-manager" target="blank"><img src="https://api.travis-ci.org/zygis/flow-manager.png" alt="build status" /></a>

Small library to manage async functions.

## Another (async|steps|flow|etc) library?

Well... Yes. But this one is dead simple. Simple library - less overhead and less bugs.

## Instalation

```
npm install flow-manager
```

## How it works?

Create "Flow" object and add some steps. "Step" is a simple callback with two arguments: flow object and data object.

```javascript
var Flows = require('flow-manager');

var flow = Flows
            .create();
            .addStep(function (flow, data) {
                // some awesome stuff
                data.step1 = 'done';
                flow.next(data);
            })
            .addStep(function (flow, data) {
                console.log(data); // {initialData: {isAwesome: true}, step1: true}

                // to destroy flow object use:
                Flows.destroy(flow);
                // OR if this is the last step, after another .next() it will be destroyed
                flow.next();
                //
            })
            .execute({
                initialData: {isAwesome: true}
            });
```

If something goes wrong:

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
            console.log('All went OK', data); // Expected: All went OK {step1: true, step2: true}
        })
        .catch(function (data) {
            console.log('Something goes wrong', data);
        })
        .execute({
            step1: false,
            step2: false
        });

// Result:
// Something goes wrong {step1: true, step2: false}
```






## Example

