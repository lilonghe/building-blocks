import React from 'react';
import {Drawer, Input, Button, Popconfirm, Select, Tabs} from 'antd';
import style from './EditComponentModal.styl';
import templates from "../../components/templates";

export default class EditComponentModal extends React.Component {
    render() {
        const { target: { id, tag, property={} }, visible, onClose, onChangeProperty, delEle } = this.props;
        if (!id) return <div></div>;

        let template = templates.find(item=>item.tag===tag);

        const renderItem = (item) => <div className={style.formGroup}>
            <div className={style.formLabel}>{item.label}:</div>
            <>
                {item.options && <Select style={{width: 200}} onChange={val=>onChangeProperty(id, item.key,val)} defaultValue={property[item.key]}>
                    {item.options.map(opt=><Select.Option key={opt} value={opt}>{opt}</Select.Option>)}
                </Select>}
                {!item.options && <Input style={{width: 200}} onChange={(e)=>onChangeProperty(id, item.key,e.target.value)} defaultValue={property[item.key]} />}
            </>

        </div>;
        let styleProperty = template.property.filter(item=>item.type==='style');
        let normalProperty = template.property.filter(item=>!item.type);
        return <Drawer
            title={'修改属性 - '+ template.title}
            width={600}
            visible={visible}
            destroyOnClose={true}
            onClose={onClose}>
            <div className={style.formGroup} style={{textAlign: 'right'}}>
                <Popconfirm title={'确认删除?'} onConfirm={()=>delEle(id)}>
                    <Button type='dashed' danger>删除</Button>
                </Popconfirm>
            </div>
            <Tabs defaultActiveKey={'property'}>
                {normalProperty.length > 0 && <Tabs.TabPane tab={'属性'} key={'property'}>
                    <div>
                        {template.property.filter(item=>!item.type).map(item=>renderItem(item))}
                    </div>
                </Tabs.TabPane>}
                {styleProperty.length > 0 && <Tabs.TabPane tab={'样式'} key={'style'}>
                    {styleProperty.map(item=>renderItem(item))}
                </Tabs.TabPane>}
            </Tabs>
        </Drawer>
    }
}
