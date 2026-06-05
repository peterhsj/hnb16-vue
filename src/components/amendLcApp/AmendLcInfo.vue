<template>
  <div>
    <!-- 銀行抬頭 -->
    <v-container fluid>
      <v-row align="center">
        <v-col class="py-1 text-center" cols="12">
          <span class="my-1 hnb__bankName">
            <span class="pe-1">華南商業銀行</span>
            <span class="pe-1">建成分行</span>
          </span>
        </v-col>

        <v-col class="py-1 hnb__bankName text-center" cols="12">
          國內信用狀修改申請書
        </v-col>
      </v-row>
    </v-container>

    <v-table class="hnb__table hnb__table--layout" density="compact">
      <tbody>
        <tr>
          <td colspan="2">
            <div class="w-100 d-flex align-start">
              <div class="h-100 w-50">
                <p>
                  <span class="font-weight-bold">修改編號：</span>
                  第 1 次
                </p>

                <p>
                  <span class="font-weight-bold">信用狀號碼：</span>
                  099700049161000861
                </p>

                <p>
                  <span class="font-weight-bold">通知銀行：</span>
                  華南商業銀行 台北分行
                </p>

                <p>
                  <span class="font-weight-bold">受益人：</span>
                  中鴻鋼鐵股份有限公司
                </p>

                <p>
                  <span class="font-weight-bold">受益人負責人：</span>
                  林大華
                </p>

                <p>
                  <span class="font-weight-bold">負責人職稱：</span>
                  總經理
                </p>

                <p>
                  <span class="font-weight-bold">地址：</span>
                  高雄縣橋頭鄉芋寮村芋寮路317號
                </p>

                <p>
                  <span class="font-weight-bold">電話：</span>
                  07-611-7171
                </p>

                <p>
                  <span class="font-weight-bold">Email：</span>
                  a1b2c3d4e5@example.com
                </p>

                <p class="mt-3 text-subtitle-1">
                  申請修改事項：
                </p>
              </div>

              <div class="h-100 w-50">
                <p>
                  <span class="font-weight-bold">修改日期：</span>
                  民國 114 年 3 月 25 日
                </p>

                <p>
                  <span class="font-weight-bold">金額：</span>
                  新台幣陸仟萬元整
                </p>

                <p>
                  <span class="font-weight-bold">通知銀行編號：</span>
                  01
                </p>

                <p class="mt-5">
                  <span class="font-weight-bold">有效期限至：</span>
                  民國 114 年 6 月 10 日
                </p>
              </div>
            </div>
          </td>
        </tr>

        <tr>
          <td class="text-center">
            <span class="text-subtitle-1">原規定情形</span>
          </td>

          <td class="text-center">
            <span class="text-subtitle-1">修改情形</span>
          </td>
        </tr>

        <tr>
          <td>
            <div class="h-100">
              <p class="mb-3">
                <span class="font-weight-bold">金額：</span><br>
                新台幣 陸仟萬元整
              </p>

              <p class="mb-3">
                <span class="font-weight-bold">有效期限：</span><br>
                114/04/30
              </p>

              <p class="mb-3">
                <span class="font-weight-bold">受益人電話：</span><br>
                07-12345678
              </p>

              <p class="mb-3">
                <span class="font-weight-bold">貨物名稱：</span><br>
                測試水泥一車
              </p>
            </div>
          </td>

          <td>
            <div class="h-100">
              <p class="mb-3">
                <span class="font-weight-bold">金額：</span><br>
                新台幣 陸仟萬元整
              </p>

              <p class="mb-3">
                <span class="font-weight-bold">有效期限：</span><br>
                114/04/30
              </p>

              <p class="mb-3">
                <span class="font-weight-bold">受益人電話：</span><br>
                07-12345678
              </p>

              <p class="mb-3">
                <span class="font-weight-bold">貨物名稱：</span><br>
                測試水泥一車
              </p>
            </div>
          </td>
        </tr>

        <tr>
          <td colspan="2">
            <div class="d-flex align-start justify-space-between">
              <div class="h-100">
                <p>
                  <span class="font-weight-bold">申請人：</span>
                  林大華
                </p>

                <p>
                  <span class="font-weight-bold">地址：</span>
                  高雄縣橋頭鄉芋寮村芋寮路317號
                </p>

                <p>
                  <span class="font-weight-bold">電話：</span>
                  07-611-7171
                </p>

                <p>
                  <span class="font-weight-bold">日期：</span>
                  民國 114 年 3 月 25 日
                </p>
              </div>

              <span v-if="props.benType === 'cds'" class="px-3 text-center">
                <v-img src="../../assets/images/cds_01.gif" />
                <div class="py-1">MIAGCSqGSI</div>
              </span>

              <span v-if="props.benType === 'other'" class="px-3 text-center">
                <v-img src="../../assets/images/cds_03.gif" />
                <div class="py-1">MIAGCSqGSI</div>
              </span>
            </div>
          </td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>
<script setup lang="ts">
  import { ref } from 'vue'
  interface Props {
    benType?: string
    data?: any
  }
  const props = withDefaults(defineProps<Props>(), {
    benType: 'cds',
    data: {},
  })

  const data = ref(props.data)
  console.log('AmendLcInfo Data:', data.value)
</script>
