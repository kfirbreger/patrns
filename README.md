# Patrns
Creating some nice patterns and exploring svg with vanila javacript

## Using

## Code
This is intentaionally all done in vanilla javascript with no library or build process. Its all part of the intention.

### How controls work
to maximaize the felxibiluty in creating new pattern canvases, a controll build system is rolled into the the related object prototype. The controls function returns an object that represets the configuration required to build the control panel for the cavnas being viewed. The followig is the format for the control object
````
{
    control_id: {
        type: The input type 'range', 'checkbox', 'text', etc
        min_value: range min value. required for range, ignored for the rest
        max_value: range max value. required for range, ignored for the rest
        data_type: checks that the data matches the type if this is filled. (int, float, string etc)
        value: The (initial) value of the field
        class: css classes to add to the element. added as is
        value_list: List of values for a drop down, ignored for the rest
        object_parameter: The name of the parameter on the object that is changed by this control
    }
}
````
Where `control_id` is the id that will be given to the input element. There is also an optional save flag that can be added on the root level (outside a control element) that is set to true will add a save button. For the save button to work the canvas object needs to support the save function

### Comfortability Hacks
These are some shortcuts used in the code that are clearly the worong way to do it for a true production system, but make life easier for a fun hobby project

- Using the canvas id as the attribute name representing the drawing class in the `Arts` object
