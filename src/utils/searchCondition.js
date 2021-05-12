//订单类型
export const orderType= 
	[
		{value:-1,text:'全部'},
		{value:0,text:'免评'},
		{value:1,text:'留评'},
	]
//留评状态
export const reviewStatus=
	[
		{value:-1,text:'全部'},
		{value:0,text:'未留评'},
		{value:1,text:'已留评'}
	]
//订单状态
export const orderStaus= //订单状态
	[  
		{value:'',text:'全部'},
		{value:'0',text:'等待放单'},
		{value:'1',text:'等待接单'},
		{value:'2',text:'已接单'},
		{value:'3',text:'下单待审核'},
		{value:'4',text:'确认已下单'},
		{value:'5',text:'审核未下单'},
		{value:'8',text:'等待返款'},
		{value:'9',text:'已返款'},
		{value:'10',text:'退单等待财务退款'},
		{value:'11',text:'退单成功'},
		{value:'12',text:'返款被驳回'}
	]
//总单的订单状态
export const orderStausTotal=[
	{value:'-1',text:'全部'},
	{value:'0',text:'等待提交审核'},
	{value:'1',text:'等待财务审核'},
	{value:'2',text:'测评操作中'},
	{value:'3',text:'财务审核不通过'},
	{value:'4',text:'测评结束'},
	{value:'5',text:'等待财务处理补退差价'},
	{value:'6',text:'退单等待财务退款'},
	{value:'7',text:'退单成功'}
]

export const userType=
	[
		{value:'-1',text:'全部'},
		{value:'0',text:'卖家端'},
		{value:'1',text:'买家端'},
		{value:'2',text:'财务'}
	]
//财务订单类别
export const cwChannel=
[
	{value:'-1',text:'全部'},
	{value:'0',text:'收款'},
	{value:'1',text:'付款'}
]
// 财务货币类型
export const cwCurrency=
[
	{value:'-1',text:'全部'},
	{value:'0',text:'人民币'},
	{value:'1',text:'美元'}
]
//财务订单状态
export const cwOrderStaus=
[
	{value:'-1',text:'全部'},
	{value:'0',text:'待处理'},
	{value:'1',text:'已处理(确认)'},
	{value:'2',text:'驳回(确认)'}
]
//财务订单类型
export const cwOrderType=
[
	{value:'',text:'全部'},
	{value:'0',text:'接单收款'},
	{value:'3',text:'产品费返款'},
	{value:'4',text:'退补差价'},
	{value:'5',text:'佣金返款'},
	{value:'6',text:'追加订单收款'},
	{value:'7,8',text:'退单退款'},
	{value:'9',text:'卖家付款'}
]

export const aisle=
[
	{value:'-1',text:'全部'},
	{value:'0',text:'微信'},
	{value:'1',text:'支付宝'},
	{value:'2',text:'银行卡'},
	{value:'3',text:'PayPal'}
]

export const aisleSub=
[
	{value:'0',text:'微信'},
	{value:'1',text:'支付宝'},
	{value:'2',text:'银行卡'},
	{value:'3',text:'PayPal'}
]

export const payment=
[
	{value:'0',text:'全额支付'},
	{value:'1',text:'见单号返'},
	{value:'2',text:'预付定金'}
]

export const zjOrderType=
[
	{value:'-1',text:'全部'},
	{value:'0',text:'未处理'},
	{value:'1',text:'已抵扣'},//已抵扣中介佣金返款
	{value:'2',text:'已回款'},//中介已返款
	{value:'3',text:'已登记为员工损失'},//已由财务登记
	{value:'4',text:'回款等待审核'}, //汇款等待财务审核
	{value:'5',text:'抵扣等待审核'}
]