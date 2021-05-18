let usuallyStyleProperty = [
    {key: 'width', label: '宽度'},
    {key: 'height', label: '高度'},
    {label: '外边距', key: 'margin'},
    {label: '内边距', key: 'padding'},
    {label: '展示方式', key: 'display', options: ['block', 'inline', 'inline-block', 'flex', 'inherit', 'none'].sort()},
    {label: 'flex', key: 'flex'},
];
usuallyStyleProperty.map((item,i)=>usuallyStyleProperty[i].type = 'style');

let textProperty = { key: 'text', label: '文本' };
let valueProperty = { key: 'value', label: '内容' };
let placeholderProperty = { key: 'placeholder', label:'占位符' }

const templates = [
    {tag: 'div', title: '容器', property: [...usuallyStyleProperty]},
    {tag: 'input', selfClose: true, title: '输入框', finalTag: true, property: [
        placeholderProperty,
        valueProperty,
        ...usuallyStyleProperty]},
    {tag: 'button', title: '按钮', finalTag: true, property: [
        textProperty,
        ...usuallyStyleProperty]},
    {tag: 'label', title: '标签', property: [
        textProperty,
        ...usuallyStyleProperty
    ]},
    {tag: 'PicView', title:'图片', finalTag: true, userCustom: true, property: [
            {key: 'src', label:'图片地址'},
            {key: 'title', label:'图片介绍'},
            ...usuallyStyleProperty
    ]}
];
export default templates;