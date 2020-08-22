import React from 'react';
import { getPlaceVal, menusToTree } from '../../utils/utils';
import templates from "../../components/templates";
import PicView from "../../components/PicView";
import './base.css';

export default class Preview extends React.PureComponent {
    render() {
        const { data, elementList } = this.props;
        let elements = menusToTree(elementList);
        const loop = (data) => data.map((item) => {
            let children;
            if (item.children) {
                children = loop(item.children);
            }
            let ele;
            let tempEle = templates.find(e=>e.tag === item.tag);

            let normalProperty = {};
            let styleProperty = {};
            tempEle.property.map(t => {
                if (item.property && item.property[t.key]) {
                    if (item.property[t.key].indexOf('{{')===0 && item.property[t.key].indexOf('}}')===item.property[t.key].length-2) {
                        let dataKey = item.property[t.key].replace(/\\{{|\}\}}/g, '');
                        let rawVal = getPlaceVal(this.props.data, dataKey);
                        item.property[t.key] = rawVal;
                    }

                    if (t.type === 'style') {
                        styleProperty[t.key] = item.property[t.key];
                    } else {
                        normalProperty[t.key] = item.property[t.key];
                    }
                }
            })

            if (tempEle.userCustom) {
                if (item.tag === 'PicView') {
                    ele = <PicView
                        key={item.id}
                        {...item}
                        {...normalProperty}
                        style={styleProperty}
                    />
                }
            } else {
                if (normalProperty['text']) {
                    children = <>{normalProperty['text']}{children}</>
                }
                ele = React.createElement(item.tag, {
                    ...item,
                    ...normalProperty,
                    key: item.key || item.id,
                    id: item.id,
                    style: styleProperty,
                }, children || null);
            }
            return ele;
        });
        return (<>
            {loop(elements)}
        </>)
    }
}