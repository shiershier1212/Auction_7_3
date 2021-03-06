let app = new Vue({
    el: "#adminController",
    data: {
        user:{},
        goods:{},
        auctions:{},
        userDataList: [],
        goodsDataList: [],
        auctionsDataList: [],
        updateUserDialogVisible:false,
        updateGoodsDialogVisible:false,
        updateAuctionsDialogVisible:false,
        nowShow:1,
        addDialogVisible:0,
    },
    methods: {
        getTheUser() {
            let that = this
            axios.get("http://localhost:8081/users")
                    .then(res => {
                        console.log(res)
                        that.userDataList = res.data.data
                    })
        },
        getTheGoods() {
            let that = this
            axios.get("http://localhost:8081/goods")
                    .then(res => {
                        that.goodsDataList = res.data.data
                    })
        },
        getTheAuctions() {
            let that = this
            axios.get("http://localhost:8081/auctions")
                    .then(res => {
                        that.auctionsDataList = res.data.data
                    })
        },
        setTheShow(index) {
            this.nowShow = parseInt(index)
        },
        editUser(row) {
            this.user = row
            this.updateUserDialogVisible = true
        },
        editGoods(row){
            this.goods = row
            this.updateGoodsDialogVisible = true
        },
        editAuctions(row){
            this.auctions = row
            this.updateAuctionsDialogVisible = true
        },
        updateUser(){
            axios.put("http://localhost:8081/users/updateUserInfo",this.user)
                    .then(res=>{
                        if (res.data.status === 'ok') {
                            this.$message({message: '修改成功！', type: 'success'})
                        } else {
                            this.$message.error("修改失败！"+res.data)
                        }
                        this.updateUserDialogVisible = false
                    })
        },
        updateGoods(){
            axios.put("http://localhost:8081/goods/updateById",this.goods)
                    .then(res=>{
                        if (res.data.status === 'ok') {
                            this.$message({message: '修改成功！', type: 'success'})
                        } else {
                            this.$message.error("修改失败！"+res.data)
                        }
                        this.updateGoodsDialogVisible = false
                    })
        },

        updateAuctions(){
            axios.put("http://localhost:8081/auctions/updateById",this.auctions)
                    .then(res=>{
                        if (res.data.status === 'ok') {
                            this.$message({message: '修改成功！', type: 'success'})
                        } else {
                            this.$message.error("修改失败！"+res.data)
                        }
                        this.updateAuctionsDialogVisible = false
                    })
        },

        userDelete(row) {
            //删除用户信息
            axios.delete("http://localhost:8081/users/" + row.id)
                    .then(res => {
                        if (res.data.status === 'ok') {
                            this.$message({message: '删除成功！', type: 'success'})
                            window.location.href="adminController.html"
                        } else {
                            this.$message.error("删除失败！")
                        }
                    })
        },
        goodsDelete(row) {
            axios.delete("http://localhost:8081/goods/" + row.id)
                    .then(res => {
                        if (res.data.status === 'ok') {
                            this.$message({message: '删除成功！', type: 'success'})
                            window.location.href="adminController.html"
                        } else {
                            this.$message.error("删除失败！")
                        }
                    })
        },
        auctionsDelete(row) {
            axios.delete("http://localhost:8081/auctions/" + row.id)
                    .then(res => {
                        if (res.data.status === 'ok') {
                            this.$message({message: '删除成功！', type: 'success'})
                            window.location.href="adminController.html"
                        } else {
                            this.$message.error("删除失败！")
                        }
                    })
        },
        showTheAddDialog(){
            this.addDialogVisible = this.nowShow
        }
    },
    mounted() {
        this.getTheUser()
        this.getTheGoods()
        this.getTheAuctions()
        console.log(this.nowShow)
    },
})
