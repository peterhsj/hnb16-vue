<template>
  <div>
    <!-- 頁面標題 -->
    <h2 class="mx-4 hnb16__title">
      填寫開狀申請書 - {{ formData.beneType === 'cds' ? 'CDS' : formData.beneType === 'fpc' ? '台塑 E 化平台' : '臨櫃' }}
    </h2>

    <!-- 主表單卡片 -->
    <v-card class="border-sm mx-4 pa-4 bg-grey-lighten-4" variant="outlined">
      <v-card-text class="bg-grey-lighten-4 pa-3">
        <v-form ref="lcFormRef" @submit.prevent="onSubmit">

          <!-- ===== 表頭標題 ===== -->
          <div class="text-center mb-4">
            <div class="hnb__bankName">
              開發國內不可撤銷信用狀申請書
            </div>

            <div class="text-body-1 text-center">
              {{ headerDate }}
            </div>
          </div>

          <!-- ================================================================
              表格
          ================================================================ -->
          <v-table class="table-sm hnb__table-v bg-white" density="compact">
            <tbody>
              <tr>
                <th class="text-end text-no-wrap" scope="row" style="width: 150px;">
                  開狀銀行：
                </th>

                <td class="lc-td">
                  {{ issuingBankLabel }}
                </td>
              </tr>

              <tr>
                <th class="text-end text-no-wrap" scope="row" style="width: 150px;">
                  通知銀行：
                </th>

                <td class="lc-td">
                  <v-select
                    v-model="form.noticeBank"
                    clearable
                    color="teal-darken-2"
                    density="compact"
                    hide-details="auto"
                    item-title="title"
                    item-value="value"
                    :items="[...NOTICE_BANK_ITEMS]"
                    placeholder="請選擇"
                    variant="outlined"
                  />
                </td>
              </tr>

              <tr>
                <th class="text-end" scope="row">
                  信用狀別：
                </th>

                <td class="lc-td">
                  <template v-if="formData.beneType === 'cds' || formData.beneType === 'fpc'">
                    即期
                  </template>

                  <v-radio-group
                    v-else
                    v-model="form.lcType"
                    color="cyan-darken-3"
                    density="compact"
                    :disabled="formData.beneType !== 'other'"
                    hide-details="auto"
                    inline
                  >
                    <v-radio class="me-3" value="sight">
                      <template #label>
                        <span class="text-body-2">即期</span>
                      </template>
                    </v-radio>

                    <v-radio class="me-3" value="usance">
                      <template #label>
                        <span class="text-body-2">遠期</span>
                      </template>
                    </v-radio>
                  </v-radio-group>
                </td>
              </tr>

              <tr>
                <th class="text-end" scope="row">
                  金額：
                </th>

                <td class="lc-td">
                  <div class="d-flex align-center flex-wrap ga-2">
                    <v-select
                      v-model="form.currency"
                      color="teal-darken-2"
                      density="compact"
                      hide-details="auto"
                      item-title="title"
                      item-value="value"
                      :items="[...CURRENCY_OPTIONS]"
                      style="max-width: 120px"
                      variant="outlined"
                    />

                    <v-text-field
                      v-model="form.amount"
                      class="flex-grow-1"
                      color="teal-darken-2"
                      density="compact"
                      hide-details="auto"
                      style="min-width: 120px"
                      variant="outlined"
                    />

                    <span class="text-no-wrap">元整</span>
                  </div>
                </td>
              </tr>

              <tr>
                <th class="text-end text-no-wrap" scope="row">
                  有效期限：<br>
                  <span class="text-caption">( 未填者自開狀日三個月視為最後有效期限 )</span>
                </th>

                <td class="lc-td">
                  <v-date-input
                    v-model="form.expiryDate"
                    append-inner-icon="mdi-calendar"
                    bg-color="white"
                    color="teal-darken-2"
                    density="compact"
                    hide-details="auto"
                    placeholder="例：2026/01/01"
                    prepend-icon=""
                    style="max-width: 220px"
                    variant="outlined"
                  />
                </td>
              </tr>

              <tr>
                <th class="text-end text-no-wrap" scope="row">
                  申請人：
                </th>

                <td class="lc-td">
                  <v-text-field
                    v-model="form.applicantName"
                    color="teal-darken-2"
                    density="compact"
                    hide-details="auto"
                    variant="outlined"
                  />
                </td>
              </tr>

              <tr>
                <th class="text-end" scope="row">
                  申請人統一編號：
                </th>

                <td class="lc-td">
                  <div class="d-flex align-center ga-2 flex-wrap">
                    <v-text-field
                      v-model="form.applicantTaxId"
                      color="teal-darken-2"
                      density="compact"
                      hide-details="auto"
                      maxlength="8"
                      style="max-width: 200px"
                      variant="outlined"
                    />

                    <v-btn class="hnb__btn--default" @click="lookupApplicant">
                      查詢
                    </v-btn>
                  </div>
                </td>
              </tr>

              <tr>
                <th class="text-end" scope="row">
                  申請人地址：
                </th>

                <td class="lc-td">
                  <v-text-field
                    v-model="form.applicantAddress"
                    color="teal-darken-2"
                    density="compact"
                    hide-details="auto"
                    variant="outlined"
                  />
                </td>
              </tr>

              <tr>
                <th class="text-end text-no-wrap" scope="row">
                  申請人聯絡人電話：
                </th>

                <td class="lc-td">
                  <v-text-field
                    v-model="form.contactPhone"
                    color="teal-darken-2"
                    density="compact"
                    hide-details="auto"
                    variant="outlined"
                  />
                </td>
              </tr>

              <tr>
                <th class="text-end text-no-wrap" scope="row">
                  受益人：
                </th>

                <td class="lc-td">
                  <v-select
                    v-model="form.beneCorp"
                    class="mb-2"
                    clearable
                    color="teal-darken-2"
                    density="compact"
                    hide-details="auto"
                    item-title="title"
                    item-value="value"
                    :items="departmentOptions"
                    placeholder="請選擇受益人名稱"
                    variant="outlined"
                  />

                  <div class="d-flex align-center ga-2 mb-2">
                    <span class="text-nowrap text-end" style="width: 80px">統一編號：</span>

                    <v-text-field
                      color="teal-darken-2"
                      density="compact"
                      hide-details="auto"
                      :model-value="fpcSelectedBene?.taxId ?? ''"
                      readonly
                      variant="outlined"
                    />
                  </div>

                  <div class="d-flex align-center ga-2">
                    <span class="text-nowrap text-end" style="width: 80px">名稱：</span>

                    <v-text-field
                      color="teal-darken-2"
                      density="compact"
                      hide-details="auto"
                      :model-value="fpcSelectedBene?.corpName ?? ''"
                      readonly
                      variant="outlined"
                    />
                  </div>
                </td>
              </tr>

              <tr>
                <th class="text-end text-no-wrap" scope="row">
                  受益人之負責人：
                </th>

                <td class="lc-td">
                  {{ fpcSelectedBene?.managerName || '—' }}
                </td>
              </tr>

              <tr>
                <th class="text-end text-no-wrap" scope="row">
                  負責人職稱：
                </th>

                <td class="lc-td">
                  {{ fpcSelectedBene?.managerTitle || '—' }}
                </td>
              </tr>

              <tr>
                <th class="text-end text-no-wrap" scope="row">
                  受益人地址：
                </th>

                <td class="lc-td">
                  {{ fpcSelectedBene?.address || '—' }}
                </td>
              </tr>

              <tr>
                <th class="text-end" scope="row">
                  受益人電話：
                </th>

                <td class="lc-td">
                  <v-text-field
                    v-model="form.benePhone"
                    color="teal-darken-2"
                    density="compact"
                    hide-details="auto"
                    variant="outlined"
                  />
                </td>
              </tr>

              <tr>
                <th class="text-end" scope="row">
                  受益人Email：
                </th>

                <td class="lc-td">
                  <v-text-field
                    v-model="form.beneEmail"
                    color="teal-darken-2"
                    density="compact"
                    hide-details="auto"
                    variant="outlined"
                  />
                </td>
              </tr>

              <template v-if="formData.beneType === 'fpc'">
                <tr>
                  <th class="text-end text-no-wrap" scope="row">
                    受益人事業部：
                  </th>

                  <td class="lc-td">
                    <v-select
                      v-model="form.department"
                      clearable
                      color="teal-darken-2"
                      density="compact"
                      hide-details="auto"
                      item-title="title"
                      item-value="value"
                      :items="[...FPC_DEPT_ITEMS]"
                      placeholder="請選擇"
                      variant="outlined"
                    />
                  </td>
                </tr>

                <tr>
                  <th class="text-end text-no-wrap" scope="row">
                    客戶編號：
                  </th>

                  <td class="lc-td">
                    <v-text-field
                      v-model="form.customerNo"
                      color="teal-darken-2"
                      density="compact"
                      hide-details="auto"
                      variant="outlined"
                    />
                  </td>
                </tr>
              </template>

              <tr>
                <td class="lc-td font-weight-bold" colspan="2">
                  本信用狀可由上開受益人在不超過上開金額範圍內，依本信用狀規定條件簽發匯票洽請洽兌/付款：
                </td>
              </tr>

              <tr>
                <td class="lc-td font-weight-bold" colspan="2">
                  一、匯票之條件：
                </td>
              </tr>

              <tr>
                <th class="text-end text-no-wrap" scope="row">
                  甲、付款人：
                </th>

                <td class="lc-td">
                  <v-select
                    v-model="form.payingBank"
                    clearable
                    color="teal-darken-2"
                    density="compact"
                    hide-details="auto"
                    item-title="title"
                    item-value="value"
                    :items="[...PAYING_BANK_ITEMS]"
                    placeholder="請選擇"
                    variant="outlined"
                  />
                </td>
              </tr>

              <tr>
                <th class="text-end text-no-wrap align-top" scope="row">
                  乙、付款期限：
                </th>

                <td v-if="formData.beneType === 'cds' || formData.beneType === 'fpc'" class="lc-td">
                  見票即付。
                </td>

                <td v-else class="lc-td">
                  <v-radio-group
                    v-model="form.paymentKind"
                    color="cyan-darken-3"
                    density="compact"
                    hide-details="auto"
                  >
                    <v-radio value="sight">
                      <template #label>
                        <span class="text-body-2">見票即付。</span>
                      </template>
                    </v-radio>

                    <v-radio value="fixed">
                      <template #label>
                        <span class="text-body-2">以「定日付款」方式填寫到期日，其到期日為：</span>
                      </template>
                    </v-radio>

                    <div class="ml-5 my-2">
                      <v-radio-group
                        v-model="form.fixedExpiryBasis"
                        color="cyan-darken-3"
                        density="compact"
                        :disabled="form.paymentKind !== 'fixed'"
                        hide-details="auto"
                      >
                        <div class="d-flex align-center ga-2 mb-2">
                          <v-radio class="flex-grow-0" value="draft_invoice">
                            <template #label>
                              <span class="text-body-2 text-no-wrap">匯票發票日</span>
                            </template>
                          </v-radio>

                          <v-radio class="flex-grow-0" value="unified_invoice">
                            <template #label>
                              <span class="text-body-2 text-no-wrap">( 統一 ) 發票日</span>
                            </template>
                          </v-radio>

                          <div
                            class="d-flex align-center text-body-2 ga-2"
                          >
                            <span>起算</span>

                            <v-text-field
                              v-model="form.fixedDaysWithin"
                              color="cyan-darken-3"
                              density="compact"
                              :disabled="form.paymentKind !== 'fixed' || form.fixedExpiryBasis === 'named'"
                              hide-details="auto"
                              style="max-width: 72px"
                              variant="outlined"
                            />

                            <span>天內。</span>
                          </div>
                        </div>

                        <v-radio value="named">
                          <template #label>
                            <div class="d-flex align-center ga-2 flex-wrap">
                              <span class="text-body-2">指定期日為</span>

                              <v-date-input
                                v-model="form.namedDueDate"
                                append-inner-icon="mdi-calendar"
                                bg-color="white"
                                color="teal-darken-2"
                                density="compact"
                                :disabled="form.paymentKind !== 'fixed' || form.fixedExpiryBasis !== 'named'"
                                hide-details="auto"
                                placeholder="例：2026/01/01"
                                prepend-icon=""
                                style="max-width: 220px"
                                variant="outlined"
                              />
                            </div>
                          </template>
                        </v-radio>
                      </v-radio-group>
                    </div>
                  </v-radio-group>
                </td>
              </tr>

              <tr>
                <th class="text-end text-no-wrap" scope="row">
                  丙、金額：
                </th>

                <td class="lc-td">
                  須與相關發票上所列開金額一致或依照本信用狀其他指示。
                </td>
              </tr>

              <tr>
                <td class="lc-td font-weight-bold" colspan="2">
                  二、應檢附之單證如下：
                </td>
              </tr>

              <tr>
                <th class="text-end text-no-wrap" scope="row">
                  檢附單據：
                </th>

                <!-- CDS -->
                <td v-if="formData.beneType === 'cds'" class="lc-td">
                  <v-radio-group
                    v-model="form.cdsDeliverKind"
                    color="cyan-darken-3"
                    density="compact"
                    hide-details="auto"
                    inline
                  >
                    <v-radio value="payment">
                      <template #label>
                        <span class="text-body-2">匯票付款申請書乙份</span>。
                      </template>
                    </v-radio>

                    <v-radio class="ms-4" value="acceptance">
                      <template #label>
                        <span class="text-body-2">匯票承兌申請書乙份</span>。
                      </template>
                    </v-radio>
                  </v-radio-group>

                  <v-checkbox
                    v-model="form.deliverInvoice"
                    color="cyan-darken-3"
                    density="compact"
                    hide-details
                  >
                    <template #label>
                      <span class="text-body-2">統一發票</span>
                    </template>
                  </v-checkbox>

                  <v-checkbox
                    v-model="form.deliverOther"
                    color="cyan-darken-3"
                    density="compact"
                    hide-details
                  >
                    <template #label>
                      <span class="text-body-2">其他</span>
                    </template>
                  </v-checkbox>

                  <v-textarea
                    v-model="form.deliverOtherDetail"
                    class="mt-2"
                    color="teal-darken-2"
                    density="compact"
                    hide-details="auto"
                    placeholder="請填寫其他應檢附之單據"
                    rows="3"
                    variant="outlined"
                  />
                </td>

                <td v-else>
                  <div class="mb-2">
                    1. 匯票承兌/付款申請書乙份。
                  </div>

                  <div class="d-flex align-center flex-wrap ga-2 mb-2">
                    <span>2.</span>

                    <v-radio-group
                      v-model="form.invoiceDocKind"
                      color="cyan-darken-3"
                      density="compact"
                      hide-details="auto"
                      inline
                    >
                      <v-radio class="me-3" value="invoice">
                        <template #label>
                          <span class="text-body-2">發票</span>
                        </template>
                      </v-radio>

                      <v-radio value="unified">
                        <template #label>
                          <span class="text-body-2">統一發票</span>
                        </template>
                      </v-radio>
                    </v-radio-group>
                  </div>

                  <div class="mb-2">
                    <div class="mb-1">
                      3. 其他 ( 請註明 )：
                    </div>

                    <v-textarea
                      v-model="form.otherDocumentsNote"
                      color="teal-darken-2"
                      density="compact"
                      hide-details="auto"
                      rows="3"
                      variant="outlined"
                    />
                  </div>

                  <div>
                    <div class="mb-1">
                      4. 上項單據應載明申請人向受益人購買下列產品：
                    </div>

                    <v-textarea
                      v-model="form.productDescriptionNote"
                      color="teal-darken-2"
                      density="compact"
                      hide-details="auto"
                      rows="3"
                      variant="outlined"
                    />
                  </div>
                </td>
              </tr>

              <tr>
                <th class="text-end text-no-wrap" scope="row">
                  電子押匯之特別指示條款：
                </th>

                <td v-if="formData.beneType === 'cds'" class="lc-td">
                  <v-radio-group
                    v-model="form.electronicNote"
                    color="cyan-darken-3"
                    density="compact"
                    hide-details="auto"
                  >
                    <v-radio value="csc">
                      <template #label>
                        <span class="font-weight-bold">中鋼之電子押匯特別指示條款</span>
                      </template>
                    </v-radio>

                    <div class="ml-4 mt-2 mb-4">
                      <ol class="hnb__list--ol text-body-2">
                        <li v-for="(line, i) in cscClauses" :key="i" class="mb-2">
                          {{ line }}
                        </li>
                      </ol>
                    </div>

                    <v-radio value="custom">
                      <template #label>
                        <span class="font-weight-bold">或自行填寫電子押匯特別指示條款</span>
                      </template>
                    </v-radio>
                  </v-radio-group>

                  <div class="mt-2 ml-5">
                    <v-textarea
                      v-model="form.customElectronicNote"
                      class="text-body-2"
                      color="teal-darken-2"
                      density="compact"
                      :disabled="!cdsCustomNoteEditable"
                      hide-details="auto"
                      rows="7"
                      variant="outlined"
                    />
                  </div>

                  <div class="mt-3 font-weight-bold">特別指示條款：</div>

                  <div class="mt-2 d-inline-flex align-center">
                    <span>遠期信用狀利息：</span>

                    <v-radio-group
                      v-model="form.cdsUsanceInterest"
                      class="ml-2"
                      color="cyan-darken-3"
                      density="compact"
                      hide-details="auto"
                      inline
                    >
                      <v-radio class="me-3" value="buyer">
                        <template #label>
                          <span class="text-body-2">買方負擔</span>
                        </template>
                      </v-radio>

                      <v-radio class="me-3" value="seller">
                        <template #label>
                          <span class="text-body-2">賣方負擔</span>
                        </template>
                      </v-radio>
                    </v-radio-group>

                    <span class="text-caption">( 未填者視為由買方負擔 )</span>
                  </div>

                  <br />

                  <div class="mt-2 d-inline-flex align-center">
                    <span>承兌手續費：由</span>

                    <v-radio-group
                      v-model="form.cdsAcceptanceFee"
                      class="ml-2"
                      color="cyan-darken-3"
                      density="compact"
                      hide-details="auto"
                      inline
                    >
                      <v-radio class="me-3" value="buyer">
                        <template #label>
                          <span class="text-body-2">買方</span>
                        </template>
                      </v-radio>

                      <v-radio class="me-3" value="seller">
                        <template #label>
                          <span class="text-body-2">賣方</span>
                        </template>
                      </v-radio>
                    </v-radio-group>

                    <span>負擔<span class="text-caption"> ( 未填者視為由買方負擔 )</span></span>
                  </div>

                  <br />

                  <div class="mt-3 d-inline-flex align-center">
                    <span>分批交貨：</span>

                    <v-radio-group
                      v-model="form.partialShipment"
                      class="ml-2"
                      color="cyan-darken-3"
                      density="compact"
                      hide-details="auto"
                      inline
                    >
                      <v-radio class="me-3" value="allowed">
                        <template #label>
                          <span class="text-body-2">可以</span>
                        </template>
                      </v-radio>

                      <v-radio class="me-3" value="not_allowed">
                        <template #label>
                          <span class="text-body-2">不可以</span>
                        </template>
                      </v-radio>
                    </v-radio-group>

                    <span class="text-caption">( 未填者視為得分批交貨 )。</span>
                  </div>

                  <div class="mt-3 d-flex flex-wrap align-center ga-2">
                    <span class="text-no-wrap">最後交貨日期：</span>

                    <v-date-input
                      v-model="form.lastDeliveryDate"
                      append-inner-icon="mdi-calendar"
                      bg-color="white"
                      color="teal-darken-2"
                      density="compact"
                      hide-details="auto"
                      placeholder="例：2026/01/01"
                      prepend-icon=""
                      style="max-width: 220px"
                      variant="outlined"
                    />

                    <span class="text-caption">( 未填者自開狀日起三個月視為最後交貨日 )。</span>
                  </div>

                  <div class="mt-4">
                    <div class="mb-2">
                      其他：
                    </div>

                    <v-textarea
                      v-model="form.otherSpecialTerms"
                      color="teal-darken-2"
                      density="compact"
                      hide-details="auto"
                      placeholder="~ 其他特別指示條款 ~"
                      rows="3"
                      variant="outlined"
                    />
                  </div>
                </td>

                <!-- FPC -->
                <td v-if="formData.beneType === 'fpc'" class="lc-td">
                  <p class="mb-1">1. 匯票及匯票付款申請書使用受益人所訂格式，由受益人單獨簽章或使用數位憑證有效。</p>
                  <p class="mb-1">2. 貨物可以分批交貨。</p>

                  <div class="d-flex flex-wrap align-center ga-2 my-2">
                    <span>3. 最後交貨日期：</span>

                    <v-date-input
                      v-model="form.lastDeliveryDate"
                      append-inner-icon="mdi-calendar"
                      bg-color="white"
                      color="teal-darken-2"
                      density="compact"
                      hide-details="auto"
                      placeholder="例：2026/01/01"
                      prepend-icon=""
                      style="max-width: 220px"
                      variant="outlined"
                    />

                    <span class="text-caption">( 未填者自開狀日起三個月視為最後交貨日，惟不得超過信用狀有效日期 )。</span>
                  </div>

                  <p class="mb-1">4. 發票日期早於開狀日期可以接受。</p>
                  <p class="mb-1">5. 發票金額大於開狀金額或匯票金額可以接受。</p>
                  <p class="mb-1">6. 以受益人所屬分公司或分廠名義開立之發票押匯可以接受。</p>
                  <p class="mb-1">7. 本信狀適用 eUCP2.0 版。</p>
                  <p class="mb-1">8. 允許受益人以匯票、匯票付款申請書及發票電子檔方式押匯。</p>
                  <p class="mb-1">9. 押匯電子文件透過網址: HTTPS://ecrm.fpg.com.tw 提示。</p>

                  <div class="d-flex align-center ga-2 my-2">
                    <span>10. 遠期信用狀利息：</span>

                    <v-checkbox
                      v-model="form.usanceInterestBuyer"
                      color="cyan-darken-3"
                      density="compact"
                      hide-details
                    >
                      <template #label>
                        <span class="text-body-2">買方負擔</span>
                      </template>
                    </v-checkbox>
                  </div>

                  <div class="my-2">
                    <div class="mb-1">
                      11. 其他：
                    </div>

                    <v-textarea
                      v-model="form.otherSpecialTerms"
                      color="teal-darken-2"
                      density="compact"
                      hide-details="auto"
                      placeholder="~ 其他特別指示條款 ~"
                      rows="3"
                      variant="outlined"
                    />
                  </div>

                  <div class="d-flex flex-wrap align-center ga-2 my-2">
                    <span>12. 限定押匯日期：自</span>

                    <v-date-input
                      v-model="form.draftStartDate"
                      append-inner-icon="mdi-calendar"
                      bg-color="white"
                      color="teal-darken-2"
                      density="compact"
                      hide-details="auto"
                      placeholder="例：2026/01/01"
                      prepend-icon=""
                      style="max-width: 220px"
                      variant="outlined"
                    />

                    <span>起始可押匯。<span class="text-caption"> ( 未填寫者視為未限定押匯日期 )</span></span>
                  </div>

                  <div class="d-flex flex-wrap align-center ga-2 my-2">
                    <span>13. 發票起始開立日期：</span>

                    <v-date-input
                      v-model="form.invoiceStartDate"
                      append-inner-icon="mdi-calendar"
                      bg-color="white"
                      color="teal-darken-2"
                      density="compact"
                      hide-details="auto"
                      placeholder="例：2026/01/01"
                      prepend-icon=""
                      style="max-width: 220px"
                      variant="outlined"
                    />

                    <span class="text-caption">( 以統一發票日起算匯票到其日期者，請填寫此項，未填寫者視為未限制發票開立日期 )。</span>
                  </div>
                </td>

                <!--  Other -->
                <td v-if="formData.beneType === 'other'" class="lc-td">
                  <div class="mb-3 d-inline-flex justify-start align-center">
                    <span class="text-no-wrap">1. 匯票承兌/付款申請書使用</span>

                    <v-radio-group
                      v-model="form.draftFormat"
                      class="d-inline-flex mx-3"
                      color="cyan-darken-3"
                      density="compact"
                      hide-details="auto"
                      inline
                    >
                      <v-radio class="me-3 flex-grow-0" value="bank">
                        <template #label>
                          <span class="text-body-2">貴行</span>
                        </template>
                      </v-radio>

                      <v-radio class="me-3 flex-grow-0" value="beneficiary">
                        <template #label>
                          <span class="text-body-2">受益人</span>
                        </template>
                      </v-radio>
                    </v-radio-group>

                    <span>所訂格式，申請書上信用狀申請人所蓋印鑑應與原留印鑑相符。</span>
                  </div>

                  <br />

                  <div class="mb-3 d-inline-flex align-center">
                    <span>2. 分批交貨：</span>

                    <v-radio-group
                      v-model="form.partialShipment"
                      class="d-inline-flex"
                      color="cyan-darken-3"
                      density="compact"
                      hide-details="auto"
                      inline
                    >
                      <v-radio class="me-3" value="allowed">
                        <template #label>
                          <span class="text-body-2">可以</span>
                        </template>
                      </v-radio>

                      <v-radio class="me-3" value="not_allowed">
                        <template #label>
                          <span class="text-body-2">不可以</span>
                        </template>
                      </v-radio>
                    </v-radio-group>

                    <span class="text-caption">( 未填者視為得分批交貨 )。</span>
                  </div>

                  <br />

                  <div class="mb-3 d-inline-flex align-center">
                    <span>3.</span>

                    <v-radio-group
                      v-model="form.discountInterest"
                      class="d-inline-flex"
                      color="cyan-darken-3"
                      density="compact"
                      hide-details="auto"
                      inline
                    >
                      <v-radio class="me-3" value="buyer">
                        <template #label>
                          <span class="text-body-2">匯票墊款利息由買方負擔</span>
                        </template>
                      </v-radio>

                      <v-radio class="me-3" value="seller">
                        <template #label>
                          <span class="text-body-2">匯票貼現利息由賣方負擔</span>
                        </template>
                      </v-radio>
                    </v-radio-group>

                    <span class="text-caption">( 未填者視為由買方負擔 )。</span>
                  </div>

                  <div class="d-flex flex-wrap align-center ga-2 mb-3">
                    <span>4. 最後交貨日期：</span>

                    <v-date-input
                      v-model="form.lastDeliveryDate"
                      append-inner-icon="mdi-calendar"
                      bg-color="white"
                      color="teal-darken-2"
                      density="compact"
                      hide-details="auto"
                      placeholder="例：2026/01/01"
                      prepend-icon=""
                      style="max-width: 220px"
                      variant="outlined"
                    />

                    <span class="text-caption">( 未填者自開狀日起三個月視為最後交貨日，惟不得超過信用狀有效期限 )。</span>
                  </div>

                  <div class="d-flex flex-wrap align-center ga-2 mb-3">
                    <span>5. 限定押匯日期：自</span>

                    <v-date-input
                      v-model="form.draftLimitStartDate"
                      append-inner-icon="mdi-calendar"
                      bg-color="white"
                      color="teal-darken-2"
                      density="compact"
                      hide-details="auto"
                      placeholder="例：2026/01/01"
                      prepend-icon=""
                      style="max-width: 220px"
                      variant="outlined"
                    />

                    <span>起始可押匯。<span class="text-caption"> ( 未填寫者視為未限定押匯日期 )</span></span>
                  </div>

                  <div class="mb-3 d-inline-flex align-center">
                    <span>6. 承兌手續費由</span>

                    <v-radio-group
                      v-model="form.feeBearer"
                      class="d-inline-flex"
                      color="cyan-darken-3"
                      density="compact"
                      hide-details="auto"
                      inline
                    >
                      <v-radio class="me-3" value="buyer">
                        <template #label>
                          <span class="text-body-2">買方</span>
                        </template>
                      </v-radio>

                      <v-radio class="me-3" value="seller">
                        <template #label>
                          <span class="text-body-2">賣方</span>
                        </template>
                      </v-radio>
                    </v-radio-group>

                    <span>負擔<span class="text-caption"> ( 未填者視為由買方負擔 )</span>。</span>
                  </div>

                  <br />

                  <div class="mb-3 d-inline-flex align-center">
                    <span>7. 受益人押匯時，匯票承兌/付款申請書</span>

                    <v-radio-group
                      v-model="form.stampSingleParty"
                      class="d-inline-flex"
                      color="cyan-darken-3"
                      density="compact"
                      hide-details="auto"
                      inline
                    >
                      <v-radio class="me-3" value="allowed">
                        <template #label>
                          <span class="text-body-2">可以</span>
                        </template>
                      </v-radio>

                      <v-radio class="me-3" value="not_allowed">
                        <template #label>
                          <span class="text-body-2">不可以</span>
                        </template>
                      </v-radio>
                    </v-radio-group>

                    <span>僅由受益人單方蓋章。</span>
                  </div>

                  <p class="mb-3">
                    8. 押匯文件透過通知銀行之櫃台提示。
                  </p>

                  <div class="mb-3">
                    <div class="mb-1">
                      9. 其他：
                    </div>

                    <v-textarea
                      v-model="form.otherSpecialTerms"
                      color="teal-darken-2"
                      density="compact"
                      hide-details="auto"
                      placeholder="~ 其他特別指示條款 ~"
                      rows="3"
                      variant="outlined"
                    />
                  </div>
                </td>
              </tr>

              <tr v-if="formData.beneType === 'fpc'">
                <td colspan="2">
                  <p class="mb-2">
                    <span class="font-weight-bold">利率條款：</span>
                    貴行依本申請書開發信用狀所墊付之款項，申請人同意按貴我雙方所訂之利率訂價指標，按月計付利息。
                  </p>

                  <div>
                    <div class="d-flex align-center flex-wrap ga-2 my-2">
                      <v-checkbox
                        v-model="form.rateBaseChecked"
                        color="cyan-darken-3"
                        density="compact"
                        hide-details
                      />

                      <span>基準利率 加碼年率</span>

                      <v-text-field
                        v-model="form.rateBaseSpread"
                        color="teal-darken-2"
                        density="compact"
                        :disabled="!form.rateBaseChecked"
                        hide-details="auto"
                        style="max-width: 72px"
                        variant="outlined"
                      />

                      <span>% 計付利息，如貴行利率調整時亦隨同調整。</span>
                    </div>

                    <div class="d-flex align-center flex-wrap ga-2 my-2">
                      <v-checkbox
                        v-model="form.rateFixedChecked"
                        color="cyan-darken-3"
                        density="compact"
                        hide-details
                      />

                      <span>年率</span>

                      <v-text-field
                        v-model="form.rateFixedPercent"
                        color="teal-darken-2"
                        density="compact"
                        :disabled="!form.rateFixedChecked"
                        hide-details="auto"
                        style="max-width: 72px"
                        variant="outlined"
                      />

                      <span>% 固定計息。</span>
                    </div>
                  </div>

                  <p class="mb-2">
                    <span class="font-weight-bold">新臺幣短期放款計期方式：</span>
                    按日計息，以每年365天為利息計算基礎，逢閏年時亦同。利率=本金餘額×年利率×1/365×計息天數。
                  </p>

                  <p class="font-weight-bold mb-1">
                    手續費約款：
                  </p>

                  <p class="mb-1">
                    貴行依本申請書開發「利息及承兌手續費由賣方負擔」之遠期信用狀，如於信用狀有效期限屆滿而受益人未向貴行辦理承兌或申請人申請註銷信用狀時，申請人同意依開狀金額，視信用狀有效期限以三個月為一期(未滿三個月者視為一期)，按年率
                    0.1% 補繳開狀手續費。
                  </p>

                  <p class="mb-1">
                    貴行依本申請書開發「利息由買方負擔」之遠期信用狀，如有下列情形之ㄧ者，申請人同意依押匯金額及信用狀有效期限（三個月為一期，未滿三個月者視為一期），按年率 0.1%
                    補繳開狀手續費，最低金額為新台幣 1,000 元：<br>
                    (1) 受益人押匯後，申請人立即還款而未向貴行借款者。<br>
                    (2) 申請人提前清償借款，其利息加計原開狀手續費（分批押匯改貸，以第一筆押匯金額計算）合計低於新台幣 1,000 元者。
                  </p>
                </td>
              </tr>

              <tr v-if="formData.beneType === 'other'">
                <td colspan="2">
                  <p class="mb-2 d-flex flex-wrap align-center ga-1">
                    <span class="font-weight-bold">利率條款：</span>
                    <span>貴行依本申請書開發信用狀所墊付之款項，申請人同意依貴我雙方所訂之利率訂價方式，自墊款日起每月</span>

                    <v-text-field
                      v-model="form.ratePaymentDayOfMonth"
                      color="teal-darken-2"
                      density="compact"
                      hide-details="auto"
                      style="max-width: 64px"
                      variant="outlined"
                    />

                    <span>日（未填者視為撥貸日之相對日）按月計付利息。</span>
                  </p>

                  <p class="mb-2">
                    <span class="font-weight-bold">新臺幣短期放款計期方式：</span>
                    按日計息，以每年365天為利息計算基礎，逢閏年時亦同。利率=本金餘額×年利率×1/365×計息天數。
                  </p>

                  <p class="font-weight-bold mb-1">
                    手續費約款：
                  </p>

                  <ol class="hnb__list--ol">
                    <li class="mb-1">
                      1. 貴行依本申請書開發「利息及承兌手續費由賣方負擔」之遠期信用狀，如於信用狀有效期限屆滿而受益人未向貴行辦理承兌或申請人申請註銷信用狀時，申請人同意依開狀金額，視信用狀有效期限以三個月為一期(未滿三個月者視為一期)，按年率
                      0.1% 補繳開狀手續費。
                    </li>

                    <li class="mb-1">
                      2. 貴行依本申請書開發「利息由買方負擔」之遠期信用狀，如有下列情形之ㄧ者，申請人同意依押匯金額及信用狀有效期限（三個月為一期，未滿三個月者視為一期），按年率 0.1%
                      補繳開狀手續費，最低金額為新台幣 1,000 元：<br>
                      (1)受益人押匯後，申請人立即還款而未向貴行借款者。<br>
                      (2)申請人提前清償借款，其利息加計原開狀手續費（分批押匯改貸，以第一筆押匯金額計算）合計低於新台幣 1,000 元者。
                    </li>
                  </ol>
                </td>
              </tr>
            </tbody>
          </v-table>

          <!-- ===== 共用底部按鈕列 ===== -->
          <div class="d-flex flex-wrap justify-center align-center ga-2 mt-6">
            <v-btn class="hnb__btn--cancel mx-1" @click="confirmCancel">
              取消
            </v-btn>

            <v-btn class="hnb__btn--orange mx-1" @click="openPreview">
              預覽
            </v-btn>

            <v-divider class="mx-2 d-none d-md-flex" vertical />

            <v-btn class="hnb__btn--cancel mx-1" @click="resetForm">
              重設
            </v-btn>

            <v-btn class="hnb__btn--default mx-1" type="submit">
              確定
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>

    <!-- 預覽開狀申請書 Dialogs（依受益人類別顯示） -->
    <AppForCdsDialog
      v-if="formData.beneType === 'cds'"
      v-model:app-dialog="appDialog"
      :app-no="appNo"
      @on-close="appDialogClose"
    />

    <AppForFpcDialog
      v-if="formData.beneType === 'fpc'"
      v-model:app-dialog="appDialog"
      :app-no="appNo"
      @on-close="appDialogClose"
    />

    <AppForOtherDialog
      v-if="formData.beneType === 'other'"
      v-model:app-dialog="appDialog"
      :app-no="appNo"
      @on-close="appDialogClose"
    />

    <!-- 共用 Prompt Dialog -->
    <PromptDialog
      v-model:message-dialog="messageDialog"
      :is-confirm-btn="isConfirmBtn"
      :message="message"
      :message-status="messageStatus"
      :message-title="messageTitle"
      @on-close="messageClose"
      @prompt-confirm="messageConfirm"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed, reactive, ref, watch } from 'vue'
  import { VForm } from 'vuetify/components'
  import {
    CDS_BENE_ITEMS,
    createInitialLcApplicationForm,
    CURRENCY_OPTIONS,
    DEFAULT_CUSTOM_ELECTRONIC_NOTE,
    FPC_BENE_ITEMS,
    FPC_DEPT_ITEMS,
    type FpcBeneOption,
    type LcAppData,
    type LcApplicationPayload,
    NOTICE_BANK_ITEMS,
    PAYING_BANK_ITEMS,
  } from '@/types/lcApplication'

  const props = defineProps<{
    // beneType: BeneTypeOption
    formData: LcAppData
  }>()

  const emit = defineEmits<{
    'on-submit': []
    'on-cancel': []
  }>()

  const lcFormRef = ref<InstanceType<typeof VForm> | null>(null)

  // ── 共用表單物件（單一 form） ─────────────────────────────────────────────
  const form = reactive<LcApplicationPayload>(createInitialLcApplicationForm())

  const cdsCustomNoteEditable = computed(() => form.electronicNote === 'custom')

  const fpcSelectedBene = computed<FpcBeneOption | null>(() => {
    const v = form.beneCorp
    if (!v) return null
    return FPC_BENE_ITEMS.find(b => b.value === v) ?? null
  })

  // ── 共用狀態 ──────────────────────────────────────────────────────────────
  const messageDialog = ref<boolean>(false)
  const messageTitle = ref<string>('')
  const message = ref<string>('')
  const messageStatus = ref<string>('')
  const isConfirmBtn = ref<boolean>(false)
  const processStatus = ref<string>('')
  const appDialog = ref(false)
  const appNo = ref<string>('')

  const departmentOptions = computed(() => {
    if (props.formData.beneType === 'cds') {
      return [...CDS_BENE_ITEMS]
    }
    if (props.formData.beneType !== 'cds') {
      return [...FPC_BENE_ITEMS]
    }
    return []
  })

  // ── CDS 固定常數 ──────────────────────────────────────────────────────────
  const issuingBankLabel = '華南商業銀行 高雄分行'
  const cscClauses = [
    '1. 賣方所提供鋼品之一部或全部，可能產自中國鋼鐵股份有限公司或中龍鋼鐵股份有限公司(下稱中龍公司)，視實際出貨狀況而定。如產自中龍公司，賣方就其鋼品品質，負賣方責任，至如約定價格，各交易條件及優惠措施均不受影響。',
    '2. 匯票及匯票付款申請書使用中鋼格式，由受益人單獨簽章或使用數位憑證有效。',
    '3. 貨物可以分批交貨。',
    '4. 貨物明細以發票為準。',
    '5. 發票金額大於匯票金額及發票內容備註「受託代銷」字樣可以接受。',
    '6. 本信用狀適用 eUCP2.0 版。',
    '7. 允許受益人以匯票、匯票付款申請書及發票電子檔(包含電子發票證明聯等)方式押匯，另「受益人完整提示通知」得附加於匯票付款申請書之最後。',
    '8. 押匯電子文件透過網址：HTTPS://CDSLC.UXCDS.COM/CDSLC/ 提示。',
  ] as const

  // ── FPC / Other 共用常數 ──────────────────────────────────────────────────
  const headerDate = '114 年 5 月 10 日'
  // ── 監聽 formData 以初始化 / 重設表單 ─────────────────────────────────────
  watch(
    () => props.formData,
    newData => {
      const { editType, appNo: no, beneType } = newData as LcAppData
      const nextData: Partial<LcApplicationPayload> = {}
      if (beneType === 'cds' || beneType === 'fpc') {
        nextData.lcType = 'sight'
      }
      if (beneType === 'cds') {
        nextData.customElectronicNote = DEFAULT_CUSTOM_ELECTRONIC_NOTE
        nextData.department = '75708007'
      }

      if (editType === 'edit' && no) {
        Object.assign(form, createInitialLcApplicationForm(), nextData)
      } else if (editType === 'new') {
        Object.assign(form, createInitialLcApplicationForm(), nextData)
        lcFormRef.value?.reset()
      }
    },
    { immediate: true },
  )

  // ── 共用函式 ──────────────────────────────────────────────────────────────
  function resetForm (): void {
    lcFormRef.value?.reset()
  }

  function lookupApplicant (): void {
    console.log('查詢申請人資料：此為原型畫面，尚未串接後端 API。')
  }

  function openPreview (): void {
    appDialog.value = true
  }

  function confirmCancel (): void {
    messageTitle.value = '訊息通知'
    message.value = '離開不會儲存此筆資料，<br />您確認要離開嗎？'
    messageStatus.value = 'alert'
    processStatus.value = 'cancel'
    isConfirmBtn.value = true
    messageDialog.value = true
  }

  function onSubmit (): void {
    console.log('Submit payload:', form)
    try {
      messageTitle.value = '作業訊息'
      message.value = `作業已完成！<br />
您的申請書號碼為<br />
099700031161000861-A-011`
      messageStatus.value = 'success'
      isConfirmBtn.value = false
      messageDialog.value = true
      processStatus.value = 'success'
    } catch (error) {
      console.error('Error emitting submit event:', error)
    }
  }

  function messageConfirm (): void {
    if (processStatus.value === 'cancel') emit('on-cancel')
    messageDialog.value = false
  }

  function messageClose (): void {
    if (processStatus.value === 'success') emit('on-submit')
    messageDialog.value = false
  }

  function appDialogClose (): void {
    appDialog.value = false
    appNo.value = ''
  }
</script>
