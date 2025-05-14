/**
 * @typedef {Object} CheckboxState
 * @property {boolean} checked
 * @property {boolean} partialChecked
 */

/**
 * Propagates the checkbox state down the tree.
 *
 * @param {Object} node - The node to propagate state from.
 * @param {boolean} check - The value to set (true or false).
 * @param {Record<string, CheckboxState>} selectionKeys - The selection state object.
 */
export function nodePropagateDown(node, check, selectionKeys) {
    if (check) selectionKeys[node.key] = { checked: true, partialChecked: false };
    else delete selectionKeys[node.key];

    if (node.children && node.children.length) {
        for (let child of node.children) {
            nodePropagateDown(child, check, selectionKeys);
        }
    }
}

/**
 * Propagates the checkbox state up the tree.
 *
 * @param {Object} node - The node to propagate state from.
 * @param {boolean} check - The value to set (true or false).
 * @param {Record<string, CheckboxState>} selectionKeys - The selection state object.
 * @param {Array<Object>} nodes - The list of all nodes.
 */
export function nodePropagateUp(node, check, selectionKeys, nodes) {
    let checkedChildCount = 0;
    let childPartialSelected = false;

    if (node.data.parent_uuid) {
        const parentNode = findNode(nodes, node.data.parent_uuid);

        for (let child of parentNode.children) {
            if (selectionKeys[child.key] && selectionKeys[child.key].checked) checkedChildCount++;
            else if (selectionKeys[child.key] && selectionKeys[child.key].partialChecked) childPartialSelected = true;
        }

        if (check && checkedChildCount === parentNode.children.length) {
            selectionKeys[parentNode.key] = { checked: true, partialChecked: false };
        } else {
            if (!check) {
                delete selectionKeys[parentNode.key];
            }

            if (childPartialSelected || (checkedChildCount > 0 && checkedChildCount !== parentNode.children.length)) {
                selectionKeys[parentNode.key] = { checked: false, partialChecked: true };
            } else {
                selectionKeys[parentNode.key] = { checked: false, partialChecked: false };
            }
        }

        nodePropagateUp(parentNode, check, selectionKeys, nodes);
    }
}

/**
 * Finds a node in the tree by its key.
 *
 * @param {Array<Object>} nodes - The list of all nodes.
 * @param {string} targetKey - The key of the target node to find.
 * @returns {Object|null} - The node if found, otherwise null.
 */
export function findNode(nodes, targetKey) {
    for (const node of nodes) {
        if (node.key === targetKey) {
            return node;
        }
        if (node.children && node.children.length > 0) {
            const found = findNode(node.children, targetKey);
            if (found) return found;
        }
    }

    return null;
}
