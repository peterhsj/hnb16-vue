<template>
  <v-dialog
    v-model="show"
    persistent
    width="1100"
  >
    <v-card
      class="hnb__dialog"
    >
      <v-card-title class="d-flex px-4 font-weight-bold text-red-darken-3">
        <span>審核修改申請書-授信資料</span>
        <v-spacer />

        <v-btn
          density="comfortable"
          icon="mdi-close"
          variant="flat"
          @click="onClose"
        />
      </v-card-title>

      <v-form ref="formRef">
        <v-card-text class="bg-grey-lighten-4" style="max-height: 70vh; overflow-y: auto;">
          <div>
            <v-table class="hnb__table hnb__table--vertical w-100" density="compact">
              <tbody>
                <tr>
                  <th class="hnb__tbhd2 text-end w-20">
                    定價指標
                  </th>

                  <td colspan="3">
                    <v-radio-group
                      v-model="formData.pricingBenchmark"
                      color="cyan-darken-3"
                      density="compact"
                      hide-details="auto"
                      inline
                    >
                      <div class="d-flex align-center text-body-2">
                        <v-radio
                          color="cyan-darken-3"
                          density="compact"
                          hide-details
                          style="flex: none;"
                          value="01"
                        />

                        <div class="d-flex flex-column">
                          <div class="d-flex align-center my-1">
                            <span class="text-no-wrap mx-1">按貴行之基準利率加碼年率</span>

                            <v-text-field
                              v-model="formData.basisRate"
                              color="teal-darken-2"
                              density="compact"
                              hide-details
                              style="flex: none; width: 80px;"
                              variant="outlined"
                              @click.stop
                            />

                            <span class="text-no-wrap mx-1">% 計息，</span>
                          </div>

                          <div class="d-flex align-center my-1">
                            <span class="text-no-wrap mx-1">嗣後貴行基準利率每</span>

                            <v-select
                              v-model="formData.monthlyAdjust"
                              class="mx-1"
                              color="teal-darken-2"
                              density="compact"
                              hide-details="auto"
                              item-title="title"
                              item-value="value"
                              :items="[...MONTHLY_OPTIONS]"
                              style="width: 80px"
                              variant="outlined"
                            />

                            <span class="text-no-wrap mx-1">個月調整時隨同調整，加碼幅度不變。</span>
                          </div>

                        </div>
                      </div>

                      <v-divider class="my-1" />

                      <div class="d-flex align-center text-body-2">
                        <v-radio
                          color="cyan-darken-3"
                          density="compact"
                          hide-details
                          style="flex: none;"
                          value="02"
                        />

                        <div class="d-flex flex-column">
                          <div class="d-flex align-center my-1">
                            <span class="text-no-wrap mx-1">固定利率，按年率</span>

                            <v-text-field
                              v-model="formData.yearlyRate"
                              color="teal-darken-2"
                              density="compact"
                              hide-details
                              style="flex: none; width: 80px;"
                              variant="outlined"
                              @click.stop
                            />

                            <span class="text-no-wrap mx-1">% 計息。</span>
                          </div>
                        </div>
                      </div>

                      <v-divider class="my-1" />

                      <div class="d-flex align-center text-body-2">
                        <v-radio
                          color="cyan-darken-3"
                          density="compact"
                          hide-details
                          style="flex: none;"
                          value="03"
                        />

                        <div class="d-flex flex-column">
                          <div class="d-flex align-center my-1">
                            <span class="text-no-wrap mx-1">按貴行之貨幣市場</span>

                            <v-select
                              v-model="formData.currentBenchmark"
                              class="mx-1"
                              color="teal-darken-2"
                              density="compact"
                              hide-details="auto"
                              item-title="title"
                              item-value="value"
                              :items="[...CURRENT_BENCHMARK_OPTIONS]"
                              style="width: 190px"
                              variant="outlined"
                            />

                            <v-text-field
                              v-model="formData.basisDayRate"
                              class="mx-1"
                              color="teal-darken-2"
                              density="compact"
                              hide-details
                              style="flex: none; width: 80px;"
                              variant="outlined"
                              @click.stop
                            />

                            <span class="text-no-wrap mx-1">天期均價利率</span>

                            <v-text-field
                              v-model="formData.yard"
                              color="teal-darken-2"
                              density="compact"
                              hide-details
                              style="flex: none; width: 80px;"
                              variant="outlined"
                              @click.stop
                            />

                            <span class="text-no-wrap mx-1">碼</span>

                            <v-text-field
                              v-model="formData.rate2"
                              color="teal-darken-2"
                              density="compact"
                              hide-details
                              style="flex: none; width: 80px;"
                              variant="outlined"
                              @click.stop
                            />

                            <span class="text-no-wrap mx-1">% 計息，</span>
                          </div>

                          <div class="d-flex align-center my-1">
                            <span class="text-no-wrap mx-1">嗣後以貸放日後每滿</span>

                            <v-select
                              v-model="formData.monthlyAdjust"
                              class="mx-1"
                              color="teal-darken-2"
                              density="compact"
                              hide-details="auto"
                              item-title="title"
                              item-value="value"
                              :items="[...MONTHLY_OPTIONS]"
                              style="width: 80px"
                              variant="outlined"
                            />

                            <span class="text-no-wrap mx-1">個月之相對日為利率變動調整日，自調整日起隨同調整，加減碼幅度不變。</span>
                          </div>
                        </div>
                      </div>

                      <v-divider class="my-1" />

                      <div class="d-flex align-center text-body-2">
                        <v-radio
                          v-model="formData.pricingBenchmark"
                          color="cyan-darken-3"
                          density="compact"
                          hide-details
                          style="flex: none;"
                          value="04"
                        />

                        <div class="d-flex flex-column">
                          <div class="d-flex align-center my-1">
                            <span class="text-no-wrap mx-1">其他：</span>

                            <v-select
                              v-model="formData.otherReason"
                              class="mx-1"
                              color="teal-darken-2"
                              density="compact"
                              hide-details="auto"
                              item-title="title"
                              item-value="value"
                              :items="[...OTHER_REASON_OPTIONS]"
                              style="width: 200px"
                              variant="outlined"
                            />
                          </div>
                        </div>
                      </div>

                    </v-radio-group>
                  </td>
                </tr>

                <tr>
                  <th class="hnb__tbhd2 text-end w-20">
                    放款戶號
                  </th>

                  <td>
                    <v-text-field
                      v-model="formData.loanAccount"
                      color="teal-darken-2"
                      density="compact"
                      hide-details
                      variant="outlined"
                      @click.stop
                    />
                  </td>

                  <th class="hnb__tbhd2 text-end w-20">
                    信用狀金額
                  </th>

                  <td class="text-end">
                    1,000,000
                  </td>
                </tr>

                <tr>
                  <th class="hnb__tbhd2 text-end">
                    開狀放款核號
                  </th>

                  <td>
                    <v-text-field
                      v-model="formData.openLoanApprovalNo"
                      color="teal-darken-2"
                      density="compact"
                      hide-details
                      variant="outlined"
                      @click.stop
                    />
                  </td>

                  <th class="hnb__tbhd2 text-end">
                    承兌放款核號
                  </th>

                  <td>
                    <v-text-field
                      v-model="formData.acceptanceLoanApprovalNo"
                      color="teal-darken-2"
                      density="compact"
                      hide-details
                      variant="outlined"
                      @click.stop
                    />
                  </td>
                </tr>

                <tr>
                  <th class="hnb__tbhd2 text-end">
                    國內信用狀額(限)度
                  </th>

                  <td class="text-end">
                    1,000,000
                  </td>

                  <th class="hnb__tbhd2 text-end">
                    額(限)度到期日
                  </th>

                  <td>
                    2025/12/10
                  </td>
                </tr>

                <tr>
                  <th class="hnb__tbhd2 text-end">
                    國內信用狀餘額(含本件)
                  </th>

                  <td class="text-end">
                    500,000
                  </td>

                  <th class="hnb__tbhd2 text-end">
                    貸放經理人ID
                  </th>

                  <td>
                    <v-text-field
                      v-model="formData.loanManagerId"
                      color="teal-darken-2"
                      density="compact"
                      hide-details
                      variant="outlined"
                      @click.stop
                    />
                  </td>
                </tr>

                <tr>
                  <th class="hnb__tbhd2 text-end">
                    徵審主管 ID-A
                  </th>

                  <td>
                    <v-text-field
                      v-model="formData.reviewManagerIdA"
                      color="teal-darken-2"
                      density="compact"
                      hide-details
                      variant="outlined"
                      @click.stop
                    />
                  </td>

                  <th class="hnb__tbhd2 text-end">
                    徵審主管 ID-B
                  </th>

                  <td>
                    <v-text-field
                      v-model="formData.reviewManagerIdB"
                      color="teal-darken-2"
                      density="compact"
                      hide-details
                      variant="outlined"
                      @click.stop
                    />
                  </td>
                </tr>

                <tr>
                  <th class="hnb__tbhd2 text-end">
                    開狀手續費
                  </th>

                  <td>
                    <v-text-field
                      v-model="formData.openingFee"
                      color="teal-darken-2"
                      density="compact"
                      hide-details
                      variant="outlined"
                      @click.stop
                    />

                    <v-checkbox
                      v-model="formData.isStampTaxDeducted"
                      color="cyan-darken-3"
                      density="compact"
                      hide-details
                    >
                      <template #label>
                        <span class="text-body-2">扣印花稅</span>
                      </template>
                    </v-checkbox>
                  </td>

                  <th class="hnb__tbhd2 text-end">
                    承兌手續費
                  </th>

                  <td>
                    <v-text-field
                      v-model="formData.acceptanceFee"
                      color="teal-darken-2"
                      density="compact"
                      hide-details
                      variant="outlined"
                      @click.stop
                    />

                    <v-checkbox
                      v-model="formData.isAcceptanceFeeStampTaxDeducted"
                      color="cyan-darken-3"
                      density="compact"
                      hide-details
                    >
                      <template #label>
                        <span class="text-body-2">扣印花稅</span>
                      </template>
                    </v-checkbox>
                  </td>
                </tr>

                <tr>
                  <th class="hnb__tbhd2 text-end">
                    存入保證金比率(%)
                  </th>

                  <td class="text-end">
                    <v-text-field
                      v-model="formData.depositMarginRate"
                      color="teal-darken-2"
                      density="compact"
                      hide-details
                      variant="outlined"
                      @click.stop
                    >
                      <template #append>
                        <span>%</span>
                      </template>
                    </v-text-field>
                  </td>

                  <th class="hnb__tbhd2 text-end">
                    保證金
                  </th>

                  <td>
                    <v-text-field
                      v-model="formData.guaranteeDeposit"
                      color="teal-darken-2"
                      density="compact"
                      hide-details
                      variant="outlined"
                      @click.stop
                    />
                  </td>
                </tr>

                <tr>
                  <th class="hnb__tbhd2 text-end">
                    批次案號
                  </th>

                  <td>
                    <v-text-field
                      v-model="formData.batchNumber"
                      color="teal-darken-2"
                      density="compact"
                      hide-details
                      variant="outlined"
                      @click.stop
                    />
                  </td>

                  <th class="hnb__tbhd2 text-end">
                    信保通知單編號
                  </th>

                  <td>
                    <v-text-field
                      v-model="formData.noticeNo"
                      color="teal-darken-2"
                      density="compact"
                      hide-details
                      variant="outlined"
                      @click.stop
                    />
                  </td>
                </tr>

                <tr>
                  <th class="hnb__tbhd2 text-end">
                    收款方式
                  </th>

                  <td colspan="3">
                    <div class="my-2">
                      <v-radio-group
                        v-model="formData.isAuth"
                        color="cyan-darken-3"
                        density="compact"
                        hide-details="auto"
                        inline
                      >
                        <v-radio :value="true">
                          <template #label>
                            <span class="text-body-2">有授權扣帳  ( 限鍵入 690 者 )</span>
                          </template>
                        </v-radio>

                        <v-radio class="ms-4" :value="false">
                          <template #label>
                            <span class="text-body-2">無授權扣帳</span>
                          </template>
                        </v-radio>
                      </v-radio-group>
                    </div>

                    <v-table class="hnb__table hnb__table--vertical w-100" density="compact">
                      <tbody>
                        <tr>
                          <th class="hnb__tbhd2 text-end w-10">
                            現金：
                          </th>

                          <td class="text-end">
                            <v-text-field
                              v-model="formData.cashAmount"
                              color="teal-darken-2"
                              density="compact"
                              hide-details
                              variant="outlined"
                              @click.stop
                            />
                          </td>
                        </tr>

                        <tr>
                          <th class="hnb__tbhd2 text-end w-25" rowspan="2">
                            支存轉帳：
                          </th>

                          <td>
                            <div class="d-flex align-center">
                              <div class="font-weight-bold w-20 text-end">支票存款帳號 1：</div>

                              <v-text-field
                                v-model="formData.checkAccount1"
                                class="my-1"
                                color="teal-darken-2"
                                density="compact"
                                hide-details
                                variant="outlined"
                                @click.stop
                              />
                            </div>

                            <div class="d-flex align-center">
                              <div class="font-weight-bold w-20 text-end">支票號碼 1：</div>

                              <v-text-field
                                v-model="formData.checkNumber1"
                                class="my-1"
                                color="teal-darken-2"
                                density="compact"
                                hide-details
                                variant="outlined"
                                @click.stop
                              />
                            </div>

                            <div class="d-flex align-center">
                              <div class="font-weight-bold w-20 text-end">金額 1：</div>

                              <v-text-field
                                v-model="formData.checkAmount1"
                                class="my-1"
                                color="teal-darken-2"
                                density="compact"
                                hide-details
                                variant="outlined"
                                @click.stop
                              />
                            </div>
                          </td>
                        </tr>

                        <tr>

                          <td>
                            <div class="d-flex align-center">
                              <div class="font-weight-bold w-20 text-end">支票存款帳號 2：</div>

                              <v-text-field
                                v-model="formData.checkAccount2"
                                class="my-1"
                                color="teal-darken-2"
                                density="compact"
                                hide-details
                                variant="outlined"
                                @click.stop
                              />
                            </div>

                            <div class="d-flex align-center">
                              <div class="font-weight-bold w-20 text-end">支票號碼 2：</div>

                              <v-text-field
                                v-model="formData.checkNumber2"
                                class="my-1"
                                color="teal-darken-2"
                                density="compact"
                                hide-details
                                variant="outlined"
                                @click.stop
                              />
                            </div>

                            <div class="d-flex align-center">
                              <div class="font-weight-bold w-20 text-end">金額 2：</div>

                              <v-text-field
                                v-model="formData.checkAmount2"
                                class="my-1"
                                color="teal-darken-2"
                                density="compact"
                                hide-details
                                variant="outlined"
                                @click.stop
                              />
                            </div>
                          </td>
                        </tr>

                        <tr>
                          <th class="hnb__tbhd2 text-end w-25">
                            活存轉帳：
                          </th>

                          <td>
                            <div class="d-flex align-center">
                              <div class="font-weight-bold w-25 text-end">活期存款帳號：</div>

                              <v-text-field
                                v-model="formData.savingsAccount"
                                class="my-1"
                                color="teal-darken-2"
                                density="compact"
                                hide-details
                                variant="outlined"
                                @click.stop
                              />
                            </div>

                            <div class="d-flex align-center">
                              <div class="font-weight-bold w-25 text-end">第 1 張取款條金額：</div>

                              <v-text-field
                                v-model="formData.amount1"
                                class="my-1"
                                color="teal-darken-2"
                                density="compact"
                                hide-details
                                variant="outlined"
                                @click.stop
                              />
                            </div>

                            <div class="d-flex align-center">
                              <div class="font-weight-bold w-25 text-end">第 2 張取款條金額：</div>

                              <v-text-field
                                v-model="formData.amount2"
                                class="my-1"
                                color="teal-darken-2"
                                density="compact"
                                hide-details
                                variant="outlined"
                                @click.stop
                              />
                            </div>
                          </td>
                        </tr>

                        <tr>
                          <th class="hnb__tbhd2 text-end w-25">
                            轉出科目：
                          </th>

                          <td>
                            <div class="d-flex align-center">
                              <div class="font-weight-bold w-20 text-end">轉出會計科目：</div>

                              <v-text-field
                                v-model="formData.transferAccount"
                                class="my-1"
                                color="teal-darken-2"
                                density="compact"
                                hide-details
                                variant="outlined"
                                @click.stop
                              />
                            </div>

                            <div class="d-flex align-center">
                              <div class="font-weight-bold w-20 text-end">轉出銷帳序號：</div>

                              <v-text-field
                                v-model="formData.transferSerialNumber"
                                class="my-1"
                                color="teal-darken-2"
                                density="compact"
                                hide-details
                                variant="outlined"
                                @click.stop
                              />
                            </div>

                            <div class="d-flex align-center">
                              <div class="font-weight-bold w-20 text-end">轉出科目金額：</div>

                              <v-text-field
                                v-model="formData.transferAmount"
                                class="my-1"
                                color="teal-darken-2"
                                density="compact"
                                hide-details
                                variant="outlined"
                                @click.stop
                              />
                            </div>

                            <div class="d-flex align-center">
                              <div class="font-weight-bold w-20 text-end">轉出科目摘要：</div>

                              <v-text-field
                                v-model="formData.transferSummary"
                                class="my-1"
                                color="teal-darken-2"
                                density="compact"
                                hide-details
                                variant="outlined"
                                @click.stop
                              />
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </v-table>

                    <div class="d-flex justify-space-between mt-2">
                      <span>現金與轉帳收款金額合計：</span>

                      <span class="font-weight-bold mx-1">
                        3,000
                      </span>
                    </div>
                  </td>
                </tr>

                <tr>
                  <th class="hnb__tbhd2 text-end">
                    擔保條件
                  </th>

                  <td colspan="3">
                    <v-select
                      v-model="formData.guaranteeCondition"
                      class="my-1"
                      color="teal-darken-2"
                      density="compact"
                      hide-details="auto"
                      item-title="title"
                      item-value="value"
                      :items="[...GUARANTEE_CONDITION_OPTIONS]"
                      variant="outlined"
                    />

                    <v-textarea
                      v-model="formData.guaranteeConditionRemark"
                      class="my-1"
                      color="teal-darken-2"
                      density="compact"
                      hide-details
                      placeholder="請填寫擔保條件備註說明"
                      rows="4"
                      variant="outlined"
                      @click.stop
                    />
                  </td>
                </tr>

                <tr>
                  <th class="hnb__tbhd2 text-end">
                    放款帳號
                  </th>

                  <td colspan="3">
                    <v-text-field
                      v-model="formData.loanAccount"
                      class="my-1"
                      color="teal-darken-2"
                      density="compact"
                      hide-details
                      variant="outlined"
                      @click.stop
                    />
                  </td>
                </tr>

                <tr>
                  <th class="hnb__tbhd2 text-end">
                    風險條件
                  </th>

                  <td colspan="3">
                    <div class="d-flex">
                      <div class="w-50">
                        <div class="d-flex align-center">
                          <div class="font-weight-bold w-25 text-end">風險類別一：</div>

                          <v-select
                            v-model="formData.riskCategoryOne"
                            class="my-1"
                            color="teal-darken-2"
                            density="compact"
                            hide-details="auto"
                            item-title="title"
                            item-value="value"
                            :items="[...RISK_CATEGORY_OPTIONS]"
                            variant="outlined"
                          />
                        </div>

                        <div class="d-flex align-center">
                          <div class="font-weight-bold w-25 text-end">風險類別二：</div>

                          <v-select
                            v-model="formData.riskCategoryTwo"
                            class="my-1"
                            color="teal-darken-2"
                            density="compact"
                            hide-details="auto"
                            item-title="title"
                            item-value="value"
                            :items="[...RISK_CATEGORY_OPTIONS]"
                            variant="outlined"
                          />
                        </div>

                        <div class="d-flex align-center">
                          <div class="font-weight-bold w-25 text-end">風險類別三：</div>

                          <v-select
                            v-model="formData.riskCategoryThree"
                            class="my-1"
                            color="teal-darken-2"
                            density="compact"
                            hide-details="auto"
                            item-title="title"
                            item-value="value"
                            :items="[...RISK_CATEGORY_OPTIONS]"
                            variant="outlined"
                          />
                        </div>

                        <div class="d-flex align-center">
                          <div class="font-weight-bold w-25 text-end">風險類別四：</div>

                          <v-select
                            v-model="formData.riskCategoryFour"
                            class="my-1"
                            color="teal-darken-2"
                            density="compact"
                            hide-details="auto"
                            item-title="title"
                            item-value="value"
                            :items="[...RISK_CATEGORY_OPTIONS]"
                            variant="outlined"
                          />
                        </div>

                      </div>

                      <div class="w-50">
                        <div class="d-flex align-center">
                          <div class="font-weight-bold w-40 text-end">風險類別一百分比 %：</div>

                          <v-text-field
                            v-model="formData.riskCategoryOnePercentage"
                            class="my-1"
                            color="teal-darken-2"
                            density="compact"
                            hide-details
                            variant="outlined"
                            @click.stop
                          />
                        </div>

                        <div class="d-flex align-center">
                          <div class="font-weight-bold w-40 text-end">風險類別二百分比 %：</div>

                          <v-text-field
                            v-model="formData.riskCategoryTwoPercentage"
                            class="my-1"
                            color="teal-darken-2"
                            density="compact"
                            hide-details
                            variant="outlined"
                            @click.stop
                          />
                        </div>

                        <div class="d-flex align-center">
                          <div class="font-weight-bold w-40 text-end">風險類別三百分比 %：</div>

                          <v-text-field
                            v-model="formData.riskCategoryThreePercentage"
                            class="my-1"
                            color="teal-darken-2"
                            density="compact"
                            hide-details
                            variant="outlined"
                            @click.stop
                          />
                        </div>

                        <div class="d-flex align-center">
                          <div class="font-weight-bold w-40 text-end">風險類別四百分比 %：</div>

                          <v-text-field
                            v-model="formData.riskCategoryFourPercentage"
                            class="my-1"
                            color="teal-darken-2"
                            density="compact"
                            hide-details
                            variant="outlined"
                            @click.stop
                          />
                        </div>
                      </div>

                    </div>
                  </td>
                </tr>

                <tr>
                  <th class="hnb__tbhd2 text-end">
                    防制洗錢及打擊資恐作業
                  </th>

                  <td colspan="3">
                    <v-checkbox
                      v-model="formData.cleanChecked"
                      color="cyan-darken-3"
                      density="compact"
                      hide-details
                    >
                      <template #label>
                        <span class="text-body-2">已確實於 AML 系統辦理線上姓名檢核並填製「新臺幣國內信用狀業務防制洗錢及打擊資恐作業檢核表」。</span>
                      </template>
                    </v-checkbox>
                  </td>
                </tr>
              </tbody>
            </v-table>

            <!-- <div class="my-4 text-center">
              <v-btn
                class="hnb__btn--default mx-1"
                prepend-icon="mdi-download"
                variant="flat"
                @click="handleDownload"
              >
                下載電子檔
              </v-btn>

              <v-btn
                class="hnb__btn--orange mx-1"
                prepend-icon="mdi-printer"
                variant="flat"
                @click="handlePrint"
              >
                列印
              </v-btn>
            </div> -->
          </div>
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn
            class="hnb__btn--cancel mx-1 my-2"
            @click="onClose"
          >
            取消
          </v-btn>

          <v-btn
            class="hnb__btn--default mx-1 my-2"
            @click="onSave"
          >
            儲存
          </v-btn>

          <v-spacer />
        </v-card-actions>
      </v-form>

    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { VForm } from 'vuetify/components'

  const formRef = ref<InstanceType<typeof VForm>>()

  const MONTHLY_OPTIONS = [
    { title: '1', value: '01' },
    { title: '2', value: '02' },
    { title: '3', value: '03' },
    { title: '4', value: '04' },
  ]
  const CURRENT_BENCHMARK_OPTIONS = [
    { title: '1 個月定期存款利率', value: '01' },
    { title: '3 個月定期存款利率', value: '02' },
    { title: '6 個月定期存款利率', value: '03' },
    { title: '1 年定期存款利率', value: '04' },
  ]
  const OTHER_REASON_OPTIONS = [
    { title: '利率市場化', value: '01' },
    { title: '其他', value: '02' },
  ]
  const GUARANTEE_CONDITION_OPTIONS = [
    { title: '擔保條件 1', value: '01' },
    { title: '擔保條件 2', value: '02' },
  ]
  const RISK_CATEGORY_OPTIONS = [
    { title: 'B1 應收信用狀款-存款或存單', value: '01' },
    { title: 'B2 應收信用狀款-其他', value: '02' },
    { title: 'C1 其他應收款-存款或存單', value: '03' },
    { title: 'C2 其他應收款-其他', value: '04' },
  ]

  interface Props {
    isAmendLcAppCreditEditDialog?: boolean
    amendAppNo?: string
  }
  const props = withDefaults(defineProps<Props>(), {
    isAmendLcAppCreditEditDialog: false,
    amendAppNo: '',
  })

  const show = ref<boolean>(props.isAmendLcAppCreditEditDialog)
  watch(
    () => props.isAmendLcAppCreditEditDialog,
    newVal => {
      show.value = newVal
    },
  )
  watch(
    () => show.value,
    newVal => {
      emits('update:isAmendLcAppCreditEditDialog', newVal)
    },
  )

  const emits = defineEmits<{
    'update:isAmendLcAppCreditEditDialog': [boolean]
    'on-close': []
    'on-save': []
  }>()

  const formData = ref({
    pricingBenchmark: null, // 定價指標
    basisRate: '', // 加碼年率
    monthlyAdjust: '01', // 每月調整
    yearlyRate: '', // 固定年利率
    currentBenchmark: '01', // 貨幣市場基準
    basisDayRate: '', // 天期均價利率
    yard: '', // 碼
    rate2: '', // 第二利率
    isAuth: true, // 是否有授權扣帳
    cleanChecked: true, // 是否已確實洗錢防制檢核
    otherReason: null, // 其他定價指標原因
    loanAccount: '', // 放款戶號
    openLoanApprovalNo: '', // 開狀放款核號
    acceptanceLoanApprovalNo: '', // 承兌放款核號
    loanManagerId: '', // 貸放經理人ID
    reviewManagerIdA: '', // 徵審主管 ID-A
    reviewManagerIdB: '', // 徵審主管 ID-B
    openingFee: '', // 開狀手續費
    isStampTaxDeducted: false, // 開狀手續費是否扣印花稅
    acceptanceFee: '', // 承兌手續費
    isAcceptanceFeeStampTaxDeducted: false, // 承兌手續費是否扣印花稅
    depositMarginRate: '', // 存入保證金比率
    guaranteeDeposit: '', // 保證金
    batchNumber: '', // 批次案號
    noticeNo: '', // 信保通知單編號
    cashAmount: '', // 現金金額
    checkAccount1: '', // 支票存款帳號 1
    checkNumber1: '', // 支票號碼 1
    checkAmount1: '', // 金額 1
    checkAccount2: '', // 支票存款帳號 2
    checkNumber2: '', // 支票號碼 2
    checkAmount2: '', // 金額 2
    savingsAccount: '', // 活期存款帳號
    amount1: '', // 第 1 張取款條金額
    amount2: '', // 第 2 張取款條金額
    transferAccount: '', // 轉出會計科目
    transferSerialNumber: '', // 轉出銷帳序號
    transferAmount: '', // 轉出科目金額
    transferSummary: '', // 轉出科目摘要
    guaranteeCondition: null, // 擔保條件
    guaranteeConditionRemark: '', // 擔保條件備註說明
    riskCategoryOne: null, // 風險類別一
    riskCategoryTwo: null, // 風險類別二
    riskCategoryThree: null, // 風險類別三
    riskCategoryFour: null, // 風險類別四
    riskCategoryOnePercentage: '', // 風險類別一百分比
    riskCategoryTwoPercentage: '', // 風險類別二百分比
    riskCategoryThreePercentage: '', // 風險類別三百分比
    riskCategoryFourPercentage: '', // 風險類別四百分比
  })

  function onClose (): void {
    show.value = false
    emits('on-close')
  }

  function onSave (): void {
    console.log('儲存')
    // TODO: 儲存邏輯

    emits('on-save')
    show.value = false
  }

  function handlePrint (): void {
    window.print()
  }

  function handleDownload (): void {
    console.log('下載電子檔')
  }
</script>
