
let _Vue = null
export default  class VueRouter {
    static install(Vue){
        //1 判断当前插件是否被安装
        if(VueRouter.install.installed){
            return;
        }
        VueRouter.install.installed = true
        //2 把Vue的构造函数记录在全局
        _Vue = Vue
        //3 把创建Vue的实例传入的router对象注入到Vue实例
        // _Vue.prototype.$router = this.$options.router
        _Vue.mixin({
            beforeCreate(){
                if(this.$options.router){
                    _Vue.prototype.$router = this.$options.router
                    
                }
               
            }
        })
    }
    constructor(options){
        this.options = options
        this.routeMap = {}
        // observable
        this.data = _Vue.observable({
            current:"#/" // 当前路径
        })
        this.init()

    }
    init(){
        this.createRouteMap()
        this.initComponent(_Vue)
        this.initEvent()
    }
    createRouteMap(){
        //遍历所有的路由规则 吧路由规则解析成键值对的形式存储到routeMap中
        this.options.routes.forEach(route => {
            route.path='#'+route.path
            this.routeMap[route.path] = route.component
            console.log(this.routeMap)
        });
    }
    initComponent(Vue){
        Vue.component("router-link",{
            props:{
                to:String
            },
            render(h){
                return h("a",{
                    attrs:{
                        href:'#'+this.to
                    },
                    on:{
                        click:this.clickhander
                    }
                },[this.$slots.default])
            },
            methods:{
                clickhander(e){
                    console.log(this.to)
                    history.pushState({},"",'#'+this.to) //这里用这个方法改变地址栏的地址，但是不进行跳转
                    this.$router.data.current='#'+this.to // 把当前路径改成this.to
                    e.preventDefault() // 阻止默认行为  ,然后就支持history了
                }
            }
            // template:"<a :href='to'><slot></slot><>"
        })
        const self = this
        Vue.component("router-view",{
            render(h){
                // self.data.current
                const cm=self.routeMap[self.data.current]
                return h(cm)
            }
        })
        
    }
    initEvent(){
        //
        // window.addEventListener("popstate",()=>{
        //     console.log(this.data.current);
        //     this.data.current = window.location.pathname
        // })
        window.addEventListener("hashchange",()=>{ // hash改变时候触发的事件
            console.log('zhixingle ',this.data.current);
            this.data.current = window.location.hash
        })
    }
}