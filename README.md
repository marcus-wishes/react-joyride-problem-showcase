# showcase of delayed next step flickering

In a tour I have a complex component, which is mounted for a step in the tour, and unmounted after the step.
For this I use the flushSync function from react-dom, and increment the setIndex in the callback.
This cannot be done during the renderings, therefore I use a window.setTimeout to wrap it.

This creates a flickering of the overlay, because of the **hideSpotlight()** in src/components/Overlay.tsx.

If I remove the **LIFECYCLE.INIT** and **LIFECYCLE.COMPLETE** from the hiddenLifecycles array, the flickering is gone.

I implemented a prop *keepOverlayMountedBetweenSteps* which defaults to true and which keeps  **LIFECYCLE.INIT** and **LIFECYCLE.COMPLETE** in the hiddenLifecycles array. If it is set to false, those two lifecycles are removed from the hiddenLifecycles array.


