import React from 'react';
import { Button, Divider } from 'antd';

export default class Toolbox extends React.Component {
    render() {

        const { onDrag, templates } = this.props;
        const userCustomList = templates.filter(item=>item.userCustom);

        const renderItem = item => <Button onDragStart={onDrag} draggable="true" tag={item.tag} data={item}>{item.title}</Button>
        return <div>
            <p style={{color:'#999'}}>原生组件</p>
            {templates.filter(item=>!item.userCustom).map(item=>renderItem(item))}
            <Divider />
            <p style={{color:'#999'}}>自定义组件</p>
            {userCustomList.map(item=>renderItem(item))}
        </div>
    }
}
