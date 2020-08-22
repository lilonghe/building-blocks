export function getPlaceVal(data, placeholder) {
    if (placeholder.indexOf('{{') === 0 && placeholder.lastIndexOf('}}') === placeholder.length - 2) {
        let rawPlaceholder = placeholder.replace(/\{|\}}/g, '');
        let val = {...data};
        let vals = rawPlaceholder.split('.');
        vals.map(v=>{
            val = val[v];
        })
        return val;
    }
    return placeholder;
}

export function menusToTree(menus) {
        let data = JSON.parse(JSON.stringify(menus));
        data.forEach(item => {
            delete item.children;
        });

        const map = {};
        data.forEach(item => {
            map[item.id] = item;
        });

        const val = [];
        data.forEach(item => {
            const parent = map[item.parent_id];

            if (parent) {
                if (parent.parents) {
                    item.parents = parent.parents.concat(parent.id);
                } else {
                    item.parents = [parent.id];
                }
                (parent.children || (parent.children = [])).push(item);
            } else {
                val.push(item);
            }
        });
        return val;
    }