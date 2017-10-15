<template>
    <div class="add-goods-container">
        <h1>添加商品</h1>
        <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="商品名称" required>
                <el-input v-model="form.title"></el-input>
            </el-form-item>
            <el-form-item label="商品价格'">
                <el-input v-model="form.price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="关键字'">
                <el-input v-model="form.keywords" aria-placeholder="用分号分割"></el-input>
            </el-form-item>

             <el-form-item>
                <el-button type="primary" @click="onSubmit">立即创建</el-button>
                <el-button @click="toList">查看列表</el-button>
            </el-form-item>
        </el-form>        
    </div>
</template>

<script>
import { message } from './../services/message.js'
import requestApi from './../services/request.api.js'
export default {
  data () {
    return {
       form: {
           title: "",
           price: null,
           keywords: ""
       }
    }
  },
  mounted () {
    //   this.onSubmit()
  },
  methods: {
      toList() {
          this.$router.push({
              path: 'goods'
          })
      },
      onSubmit() {
          
          if(!this.form.title) {
              message(this, 'warning', '请填写商品名')
              return
          }

          var form = {
              title: this.form.title,
              price: this.form.price
          }

          if(this.form.keywords!== "") {
            var keywords = this.form.keywords.split(";|；")
            if (keywords) {
              form.keywords = keywords
            }
          }

          requestApi.createGood(form)
          .then(res => {
              console.log(res)
              if (res.data.status) {
                message(this, 'success', '添加商品成功')
                this.form.title = ""
                this.form.price = null ;
                this.form.keywords = ""
              }else {
                message(this, 'error', res.data.errorMessage)
              }
             
          })
          .catch(err => {
              console.log(err)
          })
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
    .add-goods-container {
        width: 500px;
        margin: 0 auto;
    }
</style>