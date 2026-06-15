<template>
  <div>
    <v-row class="flex-column justify-center">
      <v-col class="mx-auto" cols="12" md="8" sm="12">
        <v-card class="border-sm bg-white" variant="outlined">
          <v-card-text class="px-7">
            <h6 class="hnb16__title text-h6">押匯方式：</h6>

            <div class="my-2">
              <!-- <v-icon :icon="draftData.draftType === '01' ? 'mdi mdi-circle' : 'mdi mdi-circle-outline'" size="small" /> -->
              <v-radio
                v-model="draftData.draftType"
                color="cyan-darken-3"
                density="compact"
                hide-details
                style="flex: none;"
                value="01"
                @change="handleDraftType('01')"
              >
                <template #label>
                  <span class="font-weight-bold text-teal-darken-2">押匯</span>
                </template>
              </v-radio>
            </div>

            <div class="my-2 ms-7">
              <div class="font-weight-bold">撥款方式：</div>

              <v-radio-group
                v-model="draftData.pricingBenchmark"
                color="cyan-darken-3"
                density="compact"
                hide-details="auto"
              >
                <div class="d-flex align-start text-body-2 my-1">
                  <v-radio
                    class="mt-2"
                    color="cyan-darken-3"
                    density="compact"
                    hide-details
                    style="flex: none;"
                    value="01"
                  />

                  <div class="d-flex flex-column">
                    <div class="d-flex align-center my-1">
                      <span class="text-no-wrap font-weight-bold mx-1">本行-轉入帳號：</span>

                      <v-text-field
                        v-model="draftData.transferAccount"
                        class="mx-1"
                        color="teal-darken-2"
                        density="compact"
                        hide-details
                        style="flex: none; width: 200px;"
                        variant="outlined"
                        @click.stop
                      />

                      <v-btn
                        class="hnb__btn--default mx-1"
                        variant="flat"
                        @click.stop="handleCheckData"
                      >
                        檢查帳號戶名
                      </v-btn>
                    </div>

                    <div class="d-flex align-center my-1">
                      <span class="text-no-wrap mx-1">戶名：</span>

                      <v-text-field
                        v-model="draftData.accountName"
                        class="mx-1"
                        color="teal-darken-2"
                        density="compact"
                        hide-details
                        style="flex: none; width: 200px;"
                        variant="outlined"
                        @click.stop
                      />
                    </div>
                  </div>
                </div>

                <div class="d-flex align-start text-body-2 my-1">
                  <v-radio
                    color="cyan-darken-3"
                    density="compact"
                    hide-details
                    style="flex: none;"
                    value="02"
                  />

                  <div class="d-flex flex-column">
                    <div class="d-flex align-center my-1">
                      <span class="text-no-wrap font-weight-bold mx-1">跨行-付款內容詳受益人匯出匯款申請書</span>
                    </div>

                    <div class="d-flex align-center my-1">
                      <span class="text-no-wrap mx-1">匯入銀行：</span>

                      <v-text-field
                        v-model="draftData.inportBank"
                        class="mx-1"
                        color="teal-darken-2"
                        density="compact"
                        hide-details
                        style="flex: none; width: 200px;"
                        variant="outlined"
                        @click.stop
                      />

                      <span class="text-no-wrap me-1 ms-4">銀行名稱：</span>

                      <v-text-field
                        v-model="draftData.importBankName"
                        class="mx-1"
                        color="teal-darken-2"
                        density="compact"
                        hide-details
                        style="flex: none; width: 200px;"
                        variant="outlined"
                        @click.stop
                      />
                    </div>

                    <div class="d-flex align-center my-1">
                      <span class="text-no-wrap mx-1">匯款帳號：</span>

                      <v-text-field
                        v-model="draftData.importBankAccount"
                        class="mx-1"
                        color="teal-darken-2"
                        density="compact"
                        hide-details
                        style="flex: none; width: 200px;"
                        variant="outlined"
                        @click.stop
                      />
                    </div>
                  </div>
                </div>

                <div class="d-flex align-start text-body-2 my-1">
                  <v-radio
                    class="mt-1"
                    color="cyan-darken-3"
                    density="compact"
                    hide-details
                    style="flex: none;"
                    value="03"
                  />

                  <div class="d-flex">
                    <div class="mt-3">
                      <span class="text-no-wrap font-weight-bold mx-1">轉入科目：</span>
                    </div>

                    <div class="d-flex flex-column">
                      <div class="d-flex align-center my-1">
                        <span class="text-no-wrap mx-1">轉入會計科目：</span>

                        <v-select
                          v-model="draftData.transferAccountSubject"
                          bg-color="white"
                          color="teal-darken-2"
                          density="compact"
                          hide-details="auto"
                          item-title="title"
                          item-value="value"
                          :items="[...TRANSFER_ACCOUNT_ITEMS]"
                          variant="outlined"
                        />
                      </div>

                      <div class="d-flex align-center my-1">
                        <span class="text-no-wrap mx-1">轉入銷帳序號：</span>

                        <v-text-field
                          v-model="draftData.transferWriteOffNo"
                          class="mx-1"
                          color="teal-darken-2"
                          density="compact"
                          hide-details
                          style="flex: none; width: 200px;"
                          variant="outlined"
                          @click.stop
                        />
                      </div>

                      <div class="d-flex align-center my-1">
                        <span class="text-no-wrap mx-1">轉入科目金額：</span>

                        <v-text-field
                          v-model="draftData.transferAccountAmount"
                          class="mx-1"
                          color="teal-darken-2"
                          density="compact"
                          hide-details
                          style="flex: none; width: 200px;"
                          variant="outlined"
                          @click.stop
                        />
                      </div>

                      <div class="d-flex align-center my-1">
                        <span class="text-no-wrap mx-1">轉入科目摘要：</span>

                        <v-text-field
                          v-model="draftData.transferAccountSummary"
                          class="mx-1"
                          color="teal-darken-2"
                          density="compact"
                          hide-details
                          style="flex: none; width: 200px;"
                          variant="outlined"
                          @click.stop
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </v-radio-group>

              <div class="d-flex align-center my-1">
                <span class="font-weight-bold">押匯手續費：</span>

                <v-text-field
                  v-model="draftData.handlingFee"
                  class="mx-1"
                  color="teal-darken-2"
                  density="compact"
                  hide-details
                  style="flex: none; width: 200px;"
                  variant="outlined"
                  @click.stop
                />

                <v-checkbox
                  v-model="draftData.isStampTaxDeducted"
                  class="mx-1"
                  color="cyan-darken-3"
                  density="compact"
                  hide-details
                >
                  <template #label>
                    <span class="text-body-2">扣印花稅</span>
                  </template>
                </v-checkbox>
              </div>

              <div class="d-flex align-center my-1">
                <span class="font-weight-bold">押匯放款核號：</span>

                <v-text-field
                  v-model="draftData.loanApprovalNo"
                  class="mx-1"
                  color="teal-darken-2"
                  density="compact"
                  hide-details
                  style="flex: none; width: 200px;"
                  variant="outlined"
                  @click.stop
                />

                <span>
                  <v-btn class="hnb__btn--default mx-1" variant="flat" @click="handleCheckData">
                    檢查押匯核號
                  </v-btn>
                </span>
              </div>

              <div class="d-flex align-center my-2">
                <span class="font-weight-bold">貸放經理人 ID：</span>

                <v-text-field
                  v-model="draftData.loanManagerId"
                  class="mx-1"
                  color="teal-darken-2"
                  density="compact"
                  hide-details
                  style="flex: none; width: 200px;"
                  variant="outlined"
                  @click.stop
                />
              </div>

              <div class="d-flex align-center my-2">
                <span class="font-weight-bold">徵審主管 ID-A： </span>

                <v-text-field
                  v-model="draftData.creditSupervisorAId"
                  class="mx-1"
                  color="teal-darken-2"
                  density="compact"
                  hide-details
                  style="flex: none; width: 200px;"
                  variant="outlined"
                  @click.stop
                />
              </div>

              <div class="d-flex align-center my-2">
                <span class="font-weight-bold">徵審主管 ID-B： </span>

                <v-text-field
                  v-model="draftData.creditSupervisorBId"
                  class="mx-1"
                  color="teal-darken-2"
                  density="compact"
                  hide-details
                  style="flex: none; width: 200px;"
                  variant="outlined"
                  @click.stop
                />
              </div>

              <div class="my-1 d-flex">
                <span class="font-weight-bold text-no-wrap mt-3">風險條件：</span>

                <div class="ms-1 d-flex flex-wrap w-100">
                  <div class="d-flex align-center w-50">
                    <div class="font-weight-bold w-25 text-end">風險類別一：</div>

                    <v-select
                      v-model="draftData.riskCategoryOne"
                      class="my-1 mx-1"
                      color="teal-darken-2"
                      density="compact"
                      hide-details="auto"
                      item-title="title"
                      item-value="value"
                      :items="[...RISK_CATEGORY_OPTIONS]"
                      variant="outlined"
                    />
                  </div>

                  <div class="d-flex align-center w-50">
                    <div class="font-weight-bold w-40 text-end">風險類別一百分比 %：</div>

                    <v-text-field
                      v-model="draftData.riskCategoryOnePercentage"
                      class="my-1 mx-1"
                      color="teal-darken-2"
                      density="compact"
                      hide-details
                      variant="outlined"
                      @click.stop
                    />
                  </div>

                  <div class="d-flex align-center w-50">
                    <div class="font-weight-bold w-25 text-end">風險類別二：</div>

                    <v-select
                      v-model="draftData.riskCategoryTwo"
                      class="my-1 mx-1"
                      color="teal-darken-2"
                      density="compact"
                      hide-details="auto"
                      item-title="title"
                      item-value="value"
                      :items="[...RISK_CATEGORY_OPTIONS]"
                      variant="outlined"
                    />
                  </div>

                  <div class="d-flex align-center w-50">
                    <div class="font-weight-bold w-40 text-end">風險類別二百分比 %：</div>

                    <v-text-field
                      v-model="draftData.riskCategoryTwoPercentage"
                      class="my-1 mx-1"
                      color="teal-darken-2"
                      density="compact"
                      hide-details
                      variant="outlined"
                      @click.stop
                    />
                  </div>

                  <div class="d-flex align-center w-50">
                    <div class="font-weight-bold w-25 text-end">風險類別三：</div>

                    <v-select
                      v-model="draftData.riskCategoryThree"
                      class="my-1 mx-1"
                      color="teal-darken-2"
                      density="compact"
                      hide-details="auto"
                      item-title="title"
                      item-value="value"
                      :items="[...RISK_CATEGORY_OPTIONS]"
                      variant="outlined"
                    />
                  </div>

                  <div class="d-flex align-center w-50">
                    <div class="font-weight-bold w-40 text-end">風險類別三百分比 %：</div>

                    <v-text-field
                      v-model="draftData.riskCategoryThreePercentage"
                      class="my-1 mx-1"
                      color="teal-darken-2"
                      density="compact"
                      hide-details
                      variant="outlined"
                      @click.stop
                    />
                  </div>

                  <div class="d-flex align-center w-50">
                    <div class="font-weight-bold w-25 text-end">風險類別四：</div>

                    <v-select
                      v-model="draftData.riskCategoryFour"
                      class="my-1 mx-1"
                      color="teal-darken-2"
                      density="compact"
                      hide-details="auto"
                      item-title="title"
                      item-value="value"
                      :items="[...RISK_CATEGORY_OPTIONS]"
                      variant="outlined"
                    />
                  </div>

                  <div class="d-flex align-center w-50">
                    <div class="font-weight-bold w-40 text-end">風險類別四百分比 %：</div>

                    <v-text-field
                      v-model="draftData.riskCategoryFourPercentage"
                      class="my-1 mx-1"
                      color="teal-darken-2"
                      density="compact"
                      hide-details
                      variant="outlined"
                      @click.stop
                    />
                  </div>
                </div>
              </div>
            </div>

            <v-divider class="my-4" />

            <div class="ma-1">
              <!-- <v-icon :icon="draftData.draftType === '02' ? 'mdi mdi-circle' : 'mdi mdi-circle-outline'" size="small" /> -->
              <v-radio
                v-model="draftData.draftType"
                color="cyan-darken-3"
                density="compact"
                hide-details
                style="flex: none;"
                value="02"
                @change="handleDraftType('02')"
              >
                <template #label>
                  <span class="font-weight-bold text-teal-darken-2">承兌</span>
                </template>
              </v-radio>
            </div>

            <div class="my-2 ms-5">
              <div class="d-flex align-center my-2">
                <span class="font-weight-bold">承兌手續費：</span>

                <v-text-field
                  v-model="draftData.acceptanceFee"
                  class="my-1"
                  color="teal-darken-2"
                  density="compact"
                  hide-details
                  style="flex: none; width: 200px;"
                  variant="outlined"
                  @click.stop
                />

                <v-checkbox
                  v-model="draftData.isStampTaxDeducted"
                  class="mx-1"
                  color="cyan-darken-3"
                  density="compact"
                  hide-details
                >
                  <template #label>
                    <span class="text-body-2">扣印花稅</span>
                  </template>
                </v-checkbox>
              </div>

              <div class="d-flex align-center my-2">
                <span class="font-weight-bold">承兌放款核號：</span>

                <v-text-field
                  v-model="draftData.acceptanceLoanApprovalNo"
                  class="mx-1"
                  color="teal-darken-2"
                  density="compact"
                  hide-details
                  style="flex: none; width: 200px;"
                  variant="outlined"
                  @click.stop
                />

                <span>
                  <v-btn class="hnb__btn--default mx-1" variant="flat" @click="handleCheckData">
                    檢查承兌核號
                  </v-btn>
                </span>
              </div>

              <div class="d-flex align-center my-2">
                <span class="font-weight-bold">貸放經理人 ID：</span>

                <v-text-field
                  v-model="draftData.acceptanceLoanManagerId"
                  class="mx-1"
                  color="teal-darken-2"
                  density="compact"
                  hide-details
                  style="flex: none; width: 200px;"
                  variant="outlined"
                  @click.stop
                />
              </div>

              <div class="d-flex align-center my-2">
                <span class="font-weight-bold">徵審主管 ID-A： </span>

                <v-text-field
                  v-model="draftData.acceptanceCreditSupervisorAId"
                  class="mx-1"
                  color="teal-darken-2"
                  density="compact"
                  hide-details
                  style="flex: none; width: 200px;"
                  variant="outlined"
                  @click.stop
                />
              </div>

              <div class="d-flex align-center my-2">
                <span class="font-weight-bold">徵審主管 ID-B： </span>

                <v-text-field
                  v-model="draftData.acceptanceCreditSupervisorBId"
                  class="mx-1"
                  color="teal-darken-2"
                  density="compact"
                  hide-details
                  style="flex: none; width: 200px;"
                  variant="outlined"
                  @click.stop
                />
              </div>

              <div class="d-flex align-center my-2">
                <span class="font-weight-bold">押匯手續費：</span>

                <v-text-field
                  v-model="draftData.acceptanceHandlingFee"
                  class="my-1 mx-1"
                  color="teal-darken-2"
                  density="compact"
                  hide-details
                  style="flex: none; width: 200px;"
                  variant="outlined"
                  @click.stop
                />

                <v-checkbox
                  v-model="draftData.isStampTaxDeducted"
                  class="my-1 mx-1"
                  color="cyan-darken-3"
                  density="compact"
                  hide-details
                >
                  <template #label>
                    <span class="text-body-2">扣印花稅</span>
                  </template>
                </v-checkbox>
              </div>

              <div class="my-2 d-flex">
                <span class="font-weight-bold text-no-wrap">風險條件：</span>

                <div class="ms-1 d-flex flex-wrap w-100">
                  <div class="d-flex align-center w-50">
                    <div class="font-weight-bold w-25 text-end">風險類別一：</div>

                    <v-select
                      v-model="draftData.riskCategoryOne"
                      class="my-1 mx-1"
                      color="teal-darken-2"
                      density="compact"
                      hide-details="auto"
                      item-title="title"
                      item-value="value"
                      :items="[...RISK_CATEGORY_OPTIONS]"
                      variant="outlined"
                    />
                  </div>

                  <div class="d-flex align-center w-50">
                    <div class="font-weight-bold w-40 text-end">風險類別一百分比 %：</div>

                    <v-text-field
                      v-model="draftData.riskCategoryOnePercentage"
                      class="my-1 mx-1"
                      color="teal-darken-2"
                      density="compact"
                      hide-details
                      variant="outlined"
                      @click.stop
                    />
                  </div>

                  <div class="d-flex align-center w-50">
                    <div class="font-weight-bold w-25 text-end">風險類別二：</div>

                    <v-select
                      v-model="draftData.riskCategoryTwo"
                      class="my-1 mx-1"
                      color="teal-darken-2"
                      density="compact"
                      hide-details="auto"
                      item-title="title"
                      item-value="value"
                      :items="[...RISK_CATEGORY_OPTIONS]"
                      variant="outlined"
                    />
                  </div>

                  <div class="d-flex align-center w-50">
                    <div class="font-weight-bold w-40 text-end">風險類別二百分比 %：</div>

                    <v-text-field
                      v-model="draftData.riskCategoryTwoPercentage"
                      class="my-1 mx-1"
                      color="teal-darken-2"
                      density="compact"
                      hide-details
                      variant="outlined"
                      @click.stop
                    />
                  </div>

                  <div class="d-flex align-center w-50">
                    <div class="font-weight-bold w-25 text-end">風險類別三：</div>

                    <v-select
                      v-model="draftData.riskCategoryThree"
                      class="my-1 mx-1"
                      color="teal-darken-2"
                      density="compact"
                      hide-details="auto"
                      item-title="title"
                      item-value="value"
                      :items="[...RISK_CATEGORY_OPTIONS]"
                      variant="outlined"
                    />
                  </div>

                  <div class="d-flex align-center w-50">
                    <div class="font-weight-bold w-40 text-end">風險類別三百分比 %：</div>

                    <v-text-field
                      v-model="draftData.riskCategoryThreePercentage"
                      class="my-1 mx-1"
                      color="teal-darken-2"
                      density="compact"
                      hide-details
                      variant="outlined"
                      @click.stop
                    />
                  </div>

                  <div class="d-flex align-center w-50">
                    <div class="font-weight-bold w-25 text-end">風險類別四：</div>

                    <v-select
                      v-model="draftData.riskCategoryFour"
                      class="my-1 mx-1"
                      color="teal-darken-2"
                      density="compact"
                      hide-details="auto"
                      item-title="title"
                      item-value="value"
                      :items="[...RISK_CATEGORY_OPTIONS]"
                      variant="outlined"
                    />
                  </div>

                  <div class="d-flex align-center w-50">
                    <div class="font-weight-bold w-40 text-end">風險類別四百分比 %：</div>

                    <v-text-field
                      v-model="draftData.riskCategoryFourPercentage"
                      class="my-1 mx-1"
                      color="teal-darken-2"
                      density="compact"
                      hide-details
                      variant="outlined"
                      @click.stop
                    />
                  </div>
                </div>
              </div>
            </div>

            <h6 class="hnb16__title text-h6">費用付款方式：</h6>

            <v-radio-group
              v-model="draftData.paymentType"
              color="cyan-darken-3"
              density="compact"
              hide-details="auto"
            >
              <div class="d-flex align-center text-body-2 my-1">
                <v-radio
                  color="cyan-darken-3"
                  density="compact"
                  hide-details
                  style="flex: none;"
                  value="01"
                />

                <div class="d-flex">
                  <div class="d-flex align-center my-1">
                    <span class="text-no-wrap font-weight-bold mx-1">現金</span>
                  </div>
                </div>
              </div>

              <div class="d-flex align-center text-body-2 my-1">
                <v-radio
                  color="cyan-darken-3"
                  density="compact"
                  hide-details
                  style="flex: none;"
                  value="02"
                />

                <div class="d-flex">
                  <div class="d-flex align-center my-1">
                    <span class="text-no-wrap font-weight-bold mx-1">支存帳號：</span>
                  </div>

                  <div class="d-flex align-center my-1">
                    <v-text-field
                      v-model="draftData.checkAccount"
                      class="mx-1"
                      color="teal-darken-2"
                      density="compact"
                      hide-details
                      style="flex: none; width: 200px;"
                      variant="outlined"
                      @click.stop
                    />

                    <span class="text-no-wrap me-1 ms-4">支票號碼：</span>

                    <v-text-field
                      v-model="draftData.checkNo"
                      class="mx-1"
                      color="teal-darken-2"
                      density="compact"
                      hide-details
                      style="flex: none; width: 200px;"
                      variant="outlined"
                      @click.stop
                    />
                  </div>
                </div>
              </div>

              <div class="d-flex align-center text-body-2 my-1">
                <v-radio
                  color="cyan-darken-3"
                  density="compact"
                  hide-details
                  style="flex: none;"
                  value="03"
                />

                <div class="d-flex">
                  <div class="d-flex align-center my-1">
                    <span class="text-no-wrap font-weight-bold mx-1">活存帳號：</span>
                  </div>

                  <v-text-field
                    v-model="draftData.checkAccount"
                    class="mx-1"
                    color="teal-darken-2"
                    density="compact"
                    hide-details
                    style="flex: none; width: 200px;"
                    variant="outlined"
                    @click.stop
                  />
                </div>
              </div>

              <div class="d-flex align-center text-body-2 my-1">
                <v-radio
                  color="cyan-darken-3"
                  density="compact"
                  hide-details
                  style="flex: none;"
                  value="04"
                />

                <div class="d-flex">
                  <div class="d-flex align-center my-1">
                    <span class="text-no-wrap font-weight-bold mx-1">內扣</span>
                  </div>
                </div>
              </div>

              <div class="d-flex align-start text-body-2 my-1">
                <v-radio
                  class="mt-1"
                  color="cyan-darken-3"
                  density="compact"
                  hide-details
                  style="flex: none;"
                  value="05"
                />

                <div class="d-flex">
                  <div class="mt-3">
                    <span class="text-no-wrap font-weight-bold mx-1">轉出科目：</span>
                  </div>

                  <div class="d-flex flex-column">
                    <div class="d-flex align-center my-1">
                      <span class="text-no-wrap mx-1">轉出會計科目：</span>

                      <v-select
                        v-model="draftData.transferAccountSubject"
                        bg-color="white"
                        class="mx-1"
                        color="teal-darken-2"
                        density="compact"
                        hide-details="auto"
                        item-title="title"
                        item-value="value"
                        :items="[...TRANSFER_ACCOUNT_ITEMS]"
                        style="flex: none; width: 300px;"
                        variant="outlined"
                      />
                    </div>

                    <div class="d-flex align-center my-1">
                      <span class="text-no-wrap mx-1">轉出銷帳序號：</span>

                      <v-text-field
                        v-model="draftData.transferWriteOffNo"
                        class="mx-1"
                        color="teal-darken-2"
                        density="compact"
                        hide-details
                        style="flex: none; width: 300px;"
                        variant="outlined"
                        @click.stop
                      />
                    </div>

                    <div class="d-flex align-center my-1">
                      <span class="text-no-wrap mx-1">轉出科目金額：</span>

                      <v-text-field
                        v-model="draftData.transferAccountAmount"
                        class="mx-1"
                        color="teal-darken-2"
                        density="compact"
                        hide-details
                        style="flex: none; width: 300px;"
                        variant="outlined"
                        @click.stop
                      />
                    </div>

                    <div class="d-flex align-center my-1">
                      <span class="text-no-wrap mx-1">轉出科目摘要：</span>

                      <v-text-field
                        v-model="draftData.transferAccountSummary"
                        class="mx-1"
                        color="teal-darken-2"
                        density="compact"
                        hide-details
                        style="flex: none; width: 300px;"
                        variant="outlined"
                        @click.stop
                      />
                    </div>
                  </div>
                </div>
              </div>
            </v-radio-group>

            <h6 class="hnb16__title text-h6">押匯手續費優惠：</h6>

            <div class="ma-1">
              <div>
                <v-checkbox
                  v-model="draftData.isFeedDiscounted"
                  color="cyan-darken-3"
                  density="compact"
                  hide-details
                >
                  <template #label>
                    <span class="text-body-2">押匯手續費優惠</span>
                  </template>
                </v-checkbox>
              </div>

              <div class="d-flex align-center my-1 ms-7">
                優惠原因：

                <v-select
                  v-model="draftData.feeDiscountReason"
                  class="my-1"
                  color="teal-darken-2"
                  density="compact"
                  hide-details="auto"
                  item-title="title"
                  item-value="value"
                  :items="[...FEE_DISCOUNT_REASON_OPTIONS]"
                  style="flex: none; width: 300px;"
                  variant="outlined"
                />
              </div>
            </div>

          </v-card-text>
        </v-card>
      </v-col>

      <v-col class="mx-auto d-flex justify-center" cols="12" md="6" sm="12">
        <v-spacer />

        <v-btn
          class="hnb__btn--cancel mx-1 my-2"
          @click="onClose"
        >
          取消
        </v-btn>

        <v-btn
          v-if="props.isShowPreview"
          class="hnb__btn--orange mx-1 my-2"
          @click="previewApp"
        >
          預覽
        </v-btn>

        <v-btn
          class="hnb__btn--default mx-1 my-2"
          @click="onSave"
        >
          儲存
        </v-btn>

        <v-spacer />
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
  // import type { AppData } from '@/types/currentAmendDraftApp'
  import { reactive, watch } from 'vue'

  const props = defineProps<{
    isShowPreview?: boolean
  }>()

  const show = ref(true)

  // const infoData = reactive<AppData>({
  //   draftNo: '',
  //   beneType: '',
  // })

  const emits = defineEmits<{
    'on-close': []
    'on-save': []
  }>()

  const TRANSFER_ACCOUNT_ITEMS = [
    { title: '13097-099：其他應收款-雜項', value: 'ta1' },
    { title: '13097-100：其他應收款-雜項', value: 'ta2' },
    { title: '13097-101：其他應收款-雜項', value: 'ta3' },
    { title: '13097-102：其他應收款-雜項', value: 'ta4' },
  ]
  const RISK_CATEGORY_OPTIONS = [
    { title: 'B1 應收信用狀款-存款或存單', value: '01' },
    { title: 'B2 應收信用狀款-其他', value: '02' },
    { title: 'C1 其他應收款-存款或存單', value: '03' },
    { title: 'C2 其他應收款-其他', value: '04' },
  ]
  const FEE_DISCOUNT_REASON_OPTIONS = [
    { title: '優惠原因一', value: '01' },
    { title: '優惠原因二', value: '02' },
    { title: '優惠原因三', value: '03' },
    { title: '優惠原因四', value: '04' },
  ]

  const draftData = ref({
    draftType: '', // 押匯/承兌類型
    paymentType: '01', // 費用付款方式
    inportBank: '', // 匯入銀行
    importBankName: '', // 銀行名稱
    importBankAccount: '', // 匯入銀行帳號
    checkAccount: '', // 支存/活存帳號
    checkNo: '', // 支票號碼
    transferAccountSubject: '', // 轉出/轉入會計科目
    transferWriteOffNo: '', // 轉出/轉入銷帳序號
    transferAccountAmount: '', // 轉出/轉入科目金額
    transferAccountSummary: '', // 轉出/轉入科目摘要
    handlingFee: '', // 押匯手續費
    acceptanceFee: '', // 承兌手續費
    loanApprovalNo: '', // 押匯放款核號
    acceptanceLoanApprovalNo: '', // 承兌放款核號
    loanManagerId: '', // 押匯貸放經理人 ID
    acceptanceLoanManagerId: '', // 承兌貸放經理人 ID
    creditSupervisorAId: '', // 押匯徵審主管 ID-A
    acceptanceCreditSupervisorAId: '', // 承兌徵審主管 ID-A
    creditSupervisorBId: '', // 押匯徵審主管 ID-B
    acceptanceCreditSupervisorBId: '', // 承兌徵審主管 ID-B
    riskCategoryOne: '', // 風險類別一
    riskCategoryOnePercentage: '', // 風險類別一百分比
    riskCategoryTwo: '', // 風險類別二
    riskCategoryTwoPercentage: '', // 風險類別二百分比
    riskCategoryThree: '', // 風險類別三
    riskCategoryThreePercentage: '', // 風險類別三百分比
    riskCategoryFour: '', // 風險類別四
    riskCategoryFourPercentage: '', // 風險類別四百分比
    isStampTaxDeducted: false, // 是否扣印花稅
    isFeedDiscounted: false, // 是否享有手續費優惠
    feeDiscountReason: '', // 手續費優惠原因
    pricingBenchmark: '', // 定價基準
    transferAccount: '', // 轉出/轉入科目
    accountName: '', // 轉出/轉入科目名稱
    acceptanceHandlingFee: '', // 承兌手續費
  })

  function handleDraftType (type: string): void {
    draftData.value.draftType = type
  }

  function handleCheckData (): void {
    alert('檢查押匯核號')
  }

  function previewApp (): void {
    alert('預覽')
  }

  // watch(
  //   () => props.is,
  //   newData => {
  //     if (newData.draftNo) {
  //       Object.assign(infoData, newData)
  //     }
  //   },
  //   { immediate: true },
  // )

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


</script>
