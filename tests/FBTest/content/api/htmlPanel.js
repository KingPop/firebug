/* See license.txt for terms of usage */

/**
 * This file defines HTML Panel APIs for test drivers.
 */

(function() {

// ********************************************************************************************* //
// Constants

// ********************************************************************************************* //
// HTML Panel API

/**
 * Waits for an HTML mutation inside the HTML panel
 * @param {String} chrome Chrome to use.
 * @param {String} tagName Name of the tag to observe.
 * @param {Function} callback Function called as soon as a mutation occurred.
 */
this.waitForHtmlMutation = function(chrome, tagName, callback)
{
    if (!chrome)
        chrome = FW.Firebug.chrome;

    var panelNode = FBTest.selectPanel("html").panelNode;
    var attributes = {"class": "mutated"};

    // Wait for mutation event. The HTML panel will set 'mutate' class on the
    // corresponding element.
    var config = {
        target: panelNode,
        tagName: tagName,
        attributes: attributes
    }
    var mutated = new MutationRecognizer(config);
    mutated.onRecognize(function onMutate(node)
    {
        var unhighlightConfig = {
            target: node,
            attributes: attributes,
            removed: true
        };

        // Now wait till the HTML panel unhighlights the element (removes the 'mutated' class)
        var unmutated = new MutationRecognizer(unhighlightConfig);
        unmutated.onRecognizeAsync((node) =>
        {
            callback(node);
        });
    });
};

/**
 * Selects an element within the HTML panel.
 * @param {String} element Name or ID of the element to select.
 * @param {Function} callback Function called as soon as the element is selected.
 */
this.selectElementInHtmlPanel = function(element, callback)
{
    // if the parameter is a string, then find the element with the given id
    if (typeof element == "string")
    {
        var id = element;
        element = FW.Firebug.currentContext.window.document.getElementById(id);

        if (!FBTest.ok(element, "the element #"+id+" must exist in the document"))
        {
            return;
        }
    }

    // select the element in the HTML Panel
    var htmlPanel = FBTest.getPanel("html");
    htmlPanel.select(element);

    // find the related nodeBox in the HTML Panel tree that corresponds to the element
    var nodeBox = htmlPanel.panelNode.getElementsByClassName("nodeBox selected")[0];

    // Execute the callback with the nodeBox
    // xxxHonza: Sebastian, we need to get rid of the timeout
    setTimeout(function()
    {
        callback(nodeBox);
    }, 500);

    /*
    FBTest.searchInHtmlPanel(element, function(sel)
    {
        // Click on the element to make sure it's selected
        var nodeLabelBox = FW.FBL.getAncestorByClass(sel.anchorNode, "nodeLabelBox");
        var nodeTag = nodeLabelBox.querySelector(".nodeTag");
        FBTest.mouseDown(nodeTag);

        var nodeBox = FW.FBL.getAncestorByClass(sel.anchorNode, "nodeBox");
        callback(nodeBox);
    });
    */
};

/**
 * Returns selected node box - a <div> element in the HTML panel. The element should have
 * following classes set: "nodeBox containerNodeBox selected"
 */
this.getSelectedNodeBox = function()
{
    var panel = FBTest.getPanel("html");
    return panel.panelNode.querySelector(".nodeBox.selected");
}

// ********************************************************************************************* //
}).apply(FBTest);
