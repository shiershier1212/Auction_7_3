let app = new Vue({
    el: "#searchApp",
    data: {
        wantToSearch: localStorage["nowSearchGoods"],
        searchGoodsList: [],
    },
    methods: {
        searchGoods() {
            let that = this
            axios.get("http://localhost:8081/goods/getByName/" + this.wantToSearch)
                    .then(res => {
                        console.log(res.data.data)
                        if (res.data.data.length === 0) {
                            this.$message.error("未找到任何数据！")
                            return
                        }
                        that.searchGoodsList = res.data.data
                    })
                    .catch(res => {
                        console.log(res.data)
                    })
            localStorage.nowSearchGoods = this.wantToSearch
        },
        goToTheGoodsInfo(i) {
            localStorage.nowGoodId = i
            window.location.href = "goodsinfo.html"
        },
    },
})