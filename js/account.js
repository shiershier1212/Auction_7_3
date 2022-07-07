
let goods = {
    id: null,
    name: "",
    description: "",
    sell_user_id: user.id,
    buy_user_id: null,
    min_prices: 1,
    max_prices: 1,
    buyout_prices: 2,
    create_at: null,
    finished_at: "",
    status: null,
    image_url: "img/goodsImg/g (24).jpg",
}

let accountapp = new Vue({
    el: "#accountapp",
    data: {
        // user: user,
        user: {},
        goods: goods,
        activeIndex:'4',
        myGoodsList: [],//我注册的商品
        myOwnGoodsList: [],//我拍卖到的商品
        myAuctionsObj: [],//我参与的拍卖
        dialogVisible: false,
        userInfoIsShow: true,
        MyGoodsInfoIsShow: false,
        GoodsReInfoIsShow: false,
        myGoodsControl: false,
        chooseDialogVisible:false,
    },
    methods: {
        setUserInfo(){
            let that = this
            axios.get("http://localhost:8081/users/" + localStorage["nowLoginUserPhoneNumber"])
                    .then(res => {
                        console.log(res)
                        that.user = res.data.data
                        goods.sell_user_id = that.user.id
                    })
                    .catch(res => {
                        console.log(res)
                    })
        },
        setTheShow(i) {
            switch (i) {
                case 1:
                    this.userInfoIsShow = true
                    this.MyGoodsInfoIsShow = false
                    this.GoodsReInfoIsShow = false
                    this.myGoodsControl = false
                    break
                case 2:
                    let that = this
                    //获取自己注册的商品
                    axios.get("http://localhost:8081/goods/" + this.user.id)
                            .then(res => {
                                console.log(res)
                                that.myGoodsList = res.data.data
                            })
                            .catch(res => {
                                console.log(res)
                            })

                    //获取自己购买到的商品
                    axios.get("http://localhost:8081/goods/mybuy/" + this.user.id)
                            .then(res => {
                                console.log(res)
                                that.myOwnGoodsList = res.data.data
                            })
                            .catch(res => {
                                console.log(res)
                            })
                    this.userInfoIsShow = false
                    this.MyGoodsInfoIsShow = true
                    this.GoodsReInfoIsShow = false
                    this.myGoodsControl = false
                    break
                case 3:
                    this.userInfoIsShow = false
                    this.MyGoodsInfoIsShow = false
                    this.GoodsReInfoIsShow = true
                    this.myGoodsControl = false
                    break
                case 4:
                    let t = this
                    //获取自己注册的商品
                    axios.get("http://localhost:8081/goods/" + this.user.id)
                            .then(res => {
                                console.log(res)
                                t.myGoodsList = res.data.data
                            })
                            .catch(res => {
                                console.log(res)
                            })
                    // 获取自己的竞拍记录
                    axios.get("http://localhost:8081/auctions/myin/" + this.user.id)
                            .then(res => {
                                console.log(res)
                                t.myAuctionsObj = res.data.data
                            })
                            .catch(res => {
                                console.log(res)
                            })
                    this.userInfoIsShow = false
                    this.MyGoodsInfoIsShow = false
                    this.GoodsReInfoIsShow = false
                    this.myGoodsControl = true
                    break
            }
        },
        submitForm() {
            //注册商品
            if (this.user === -1) {
                this.$message.error("请先登录！！！");
                return;
            }
            if (goods.name === "" || goods.description === "" || goods.min_prices === "" || goods.buyout_prices === "") {
                this.$message.error("请输入完整的信息！");
                return;
            }
            if (goods.min_prices > goods.buyout_prices) {
                this.$message.error("买断价格不能低于起拍价格！");
                return;
            }

            axios.post("http://localhost:8081/goods", this.goods)
                    .then(res => {
                        console.log(res)
                        if (res.data.status === "ok") {
                            this.$message({message: "商品注册成功！", type: "success"});
                        } else {
                            this.$notify({
                                title: '注册商品失败',
                                message: res.data.data,
                                duration: 0
                            });
                        }
                    })
                    .catch(res => {
                        console.log(res)
                        this.$message.error("商品注册失败！" + res.data.data);
                    })
        },
        resetForm() {
            goods.name = ""
            goods.description = ""
            goods.min_prices = 1
            goods.buyout_prices = 2
            goods.duration = 240
        },
        outLogin() {
            window.location.href = "login.html"
        },
        endTheAuction(index, row) {
            //index是下标，row是这一行的数据
            if (row.status === "正进行") {
                //直接将商品的结束时间变成当前的时间，然后打开对应的商品
                let g = {
                    id: row.id,
                    finished_at: new Date()
                }
                axios.put("http://localhost:8081/goods/updateById", g)
                        .then(res => {
                            console.log(res.data)
                            localStorage.nowGoodId = row.id
                            window.location.href = "goodsinfo.html"
                        })
                        .catch(res => {
                            console.log(res.data)
                        })
            }
        },
        goToTheGoodsInfo2(index, row) {
            localStorage.nowGoodId = row.id
            window.location.href = "goodsinfo.html"
        },

        //表格的
        GoTOGoodsInfo(index, row) {
            localStorage.nowGoodId = row.goods_id
            window.location.href = "goodsinfo.html"
        },
        //div的
        goToTheGoodsInfo(i) {
            localStorage.nowGoodId = i
            window.location.href = "goodsinfo.html"
        },
        //取消自己的拍卖，不拍了
        cancelMyAuction(index, row) {
            if (row.status === "已结束") {
                this.$message.error("竞拍已经结束！无法取消！")
            } else {
                axios.delete("http://localhost:8081/auctions/deleteByMyId/" + row.buy_user_id)
                        .then(res => {
                            if (res.data.status === "ok") {
                                this.$message({message: "删除竞拍信息成功！", type: "success"})
                            } else {
                                this.$message.error("删除失败！")
                            }
                        })
            }
        },
        //修改个人信息
        changeName(){
            this.$prompt('请输入新昵称','提示',{
                confirmButtonText:'确定',
                cancelButtonText:'取消',
            }).then(({value})=>{
                let that = this
                let u = {
                    id:user.id,
                    name:value
                }
                //发送修改名字的请求
                axios.put("http://localhost:8081/users/updateUserInfo",u)
                        .then(res=>{
                            if(res.data.status==='ok'){
                                this.$message({message:'修改昵称成功!',type:'success'})
                                that.chooseDialogVisible = false
                            }else {
                                this.$message.error("修改失败！")
                            }
                        })
            })
        },
        changePassword(){
            this.$prompt('请输入新密码','提示',{
                confirmButtonText:'确定',
                cancelButtonText:'取消',
            }).then(({value})=>{
                let that = this
                let u = {
                    id:user.id,
                    password:value
                }
                //发送修改名字的请求
                axios.put("http://localhost:8081/users/updateUserInfo",u)
                        .then(res=>{
                            if(res.data.status==='ok'){
                                this.$message({message:'修改密码成功!',type:'success'})
                                that.chooseDialogVisible = false
                            }else {
                                this.$message.error("修改失败！")
                            }
                        })
            })
        }
    },
    mounted() {
        this.setUserInfo()

    },
})


