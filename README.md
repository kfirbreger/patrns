# Patrns
Creating some nice patterns and exploring canvas and svg with vanila javacript

## Using
There is no build here. The static files can just be set someplace accesible for a web server. Alternativly, use the very simple docker file included to create a container

## Code
This is intentaionally all done in vanilla javascript with no library or build process. Although at some time, webpack might be inroduced

### How controls work
to maximaize the felxibility in creating new pattern canvases, a control build system is rolled into the the related object prototype. The controls function returns an array that represets the configuration required to build the control panel for the cavnas being viewed. The followig is the format for the control object
````
[
    {
        id: The id of the input field
        label: The label for the input field
        type: The input type 'range', 'checkbox', 'text', etc
        min: range min value. required for range, ignored for the rest
        max: range max value. required for range, ignored for the rest
        step: The step size in the range
        data_type: checks that the data matches the type if this is filled. (int, float, string etc)
        value: The (initial) value of the field
        bind: If the value needs to be binded to a certain variable, give the variable here. If
                this value is given, it overwrites the value in the value field
        class: css classes to add to the element. added as is
        value_list: List of values for a drop down, ignored for the rest
    }
]
````

### Comfortability Hacks
These are some shortcuts used in the code that are clearly the worong way to do it for a true production system, but make life easier for a fun hobby project

- Using the canvas id as the attribute name representing the drawing class in the `Arts` object
