<template>
  <div>
    <!-- 頁面標題 -->
    <h2 class="mx-4 hnb16__title">填寫開狀申請書</h2>

    <!-- 主表單卡片 -->
    <v-card class="border-sm mx-4 pa-4 bg-grey-lighten-4" variant="outlined">
      <v-card-text class="bg-grey-lighten-4 pa-3">
        <v-form ref="lcFormRef" @submit.prevent="onSubmit">

          <!-- ===== FPC / Other：表頭標題 ===== -->
          <div v-if="beneType !== 'cds'" class="text-center mb-4">
            <div class="hnb__bankName">
              開發國內不可撤銷信用狀申請書
            </div>

            <div class="text-body-1">
              {{ headerDate }}
            </div>
          </div>

          <!-- ================================================================
               CDS 表格
          ================================================================ -->
          <v-table v-if="beneType === 'cds'" class="table-sm hnb__table-v bg-white" density="compact">
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
                    v-model="cdsForm.noticeBank"
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
                  <v-radio-group
                    v-model="cdsForm.lcType"
                    color="cyan-darken-3"
                    density="compact"
                    hide-details="auto"
                    inline
                  >
                    <v-radio label="即期" value="sight" />
                    <v-radio label="遠期" value="usance" />
                  </v-radio-group>
                </td>
              </tr>

              <tr>
                <th class="text-end" scope="row">
                  付款銀行：
                </th>

                <td class="lc-td">
                  {{ paymentBankLabel }}
                </td>
              </tr>

              <tr>
                <th class="text-end" scope="row">
                  金額：
                </th>

                <td class="lc-td">
                  <div class="d-flex align-center flex-wrap ga-2">
                    <v-select
                      v-model="cdsForm.currency"
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
                      v-model="cdsForm.amount"
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
                  有效期限：
                </th>

                <td class="lc-td">
                  <v-date-input
                    v-model="cdsForm.expiryDate"
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
                <th class="text-end" scope="row">
                  受益人名稱：
                </th>

                <td class="lc-td" colspan="3">
                  {{ cdsBeneficiaryName }}
                </td>
              </tr>

              <tr>
                <th class="text-end" scope="row">
                  受益人地址：
                </th>

                <td class="lc-td" colspan="3">
                  {{ cdsBeneficiaryAddress }}
                </td>
              </tr>

              <tr>
                <th class="text-end" scope="row">
                  受益人Email：
                </th>

                <td class="lc-td" colspan="3">
                  <v-text-field
                    v-model="cdsForm.beneEmail"
                    color="teal-darken-2"
                    density="compact"
                    hide-details="auto"
                    variant="outlined"
                  />
                </td>
              </tr>

              <tr>
                <th class="text-end" scope="row">
                  受益人電話：
                </th>

                <td class="lc-td" colspan="3">
                  <v-text-field
                    v-model="cdsForm.benePhone"
                    color="teal-darken-2"
                    density="compact"
                    hide-details="auto"
                    variant="outlined"
                  />
                </td>
              </tr>

              <tr>
                <th class="text-end text-no-wrap" scope="row">
                  申請人：
                </th>

                <td class="lc-td" colspan="3">
                  <v-text-field
                    v-model="cdsForm.applicantName"
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

                <td class="lc-td" colspan="3">
                  <div class="d-flex align-center ga-2 flex-wrap">
                    <v-text-field
                      v-model="cdsForm.applicantTaxId"
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

                <td class="lc-td" colspan="3">
                  <v-text-field
                    v-model="cdsForm.applicantAddress"
                    color="teal-darken-2"
                    density="compact"
                    hide-details="auto"
                    variant="outlined"
                  />
                </td>
              </tr>

              <tr>
                <th class="text-end" scope="row">
                  付款期限：
                </th>

                <td class="lc-td" colspan="3">
                  {{ cdsPaymentTermsText }}
                </td>
              </tr>

              <tr>
                <th class="text-end" scope="row">
                  貨物名稱：
                </th>

                <td class="lc-td" colspan="3">
                  <v-textarea
                    v-model="cdsForm.goodsDescription"
                    color="teal-darken-2"
                    density="compact"
                    hide-details="auto"
                    rows="3"
                    variant="outlined"
                  />
                </td>
              </tr>

              <tr>
                <th class="text-end text-no-wrap" scope="row">
                  電子押匯之特別指示條款：
                </th>

                <td class="lc-td" colspan="3">
                  <v-radio-group
                    v-model="cdsForm.electronicNote"
                    color="cyan-darken-3"
                    density="compact"
                    hide-details="auto"
                  >
                    <v-radio value="csc">
                      <template #label>
                        <span class="font-weight-bold">中鋼之電子押匯特別指示條款</span>
                      </template>
                    </v-radio>

                    <div class="ml-4 mb-4">
                      <ol class="hnb__list--ol text-body-1">
                        <li v-for="(line, i) in cscClauses" :key="i">
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
                      v-model="cdsForm.customElectronicNote"
                      color="teal-darken-2"
                      density="compact"
                      :disabled="!cdsCustomNoteEditable"
                      hide-details="auto"
                      rows="7"
                      variant="outlined"
                    />
                  </div>

                  <div class="mt-4">
                    <div class="font-weight-bold mb-2">
                      檢附單據：
                    </div>

                    <v-checkbox
                      v-model="cdsForm.deliverPaymentRequest"
                      color="cyan-darken-3"
                      density="compact"
                      hide-details
                      label="匯票付款申請書乙份"
                    />

                    <v-checkbox
                      v-model="cdsForm.deliverInvoice"
                      color="cyan-darken-3"
                      density="compact"
                      hide-details
                      label="統一發票"
                    />

                    <v-checkbox
                      v-model="cdsForm.deliverOther"
                      color="cyan-darken-3"
                      density="compact"
                      hide-details
                      label="其他"
                    />

                    <v-textarea
                      v-model="cdsForm.deliverOtherDetail"
                      class="mt-2"
                      color="teal-darken-2"
                      density="compact"
                      hide-details="auto"
                      rows="3"
                      variant="outlined"
                    />
                  </div>

                  <div class="mt-4 d-inline-flex align-center">
                    <span class="font-weight-bold">特別指示條款：</span>
                    <span class="ml-1">分批交貨：</span>

                    <v-radio-group
                      v-model="cdsForm.partialShipment"
                      class="ml-2"
                      color="cyan-darken-3"
                      density="compact"
                      hide-details="auto"
                      inline
                    >
                      <v-radio label="可以" value="allowed" />
                      <v-radio label="不可以" value="not_allowed" />
                    </v-radio-group>

                    <span class="text-body-2">（未填者視為得分批交貨）。</span>
                  </div>

                  <div class="mt-3 d-flex flex-wrap align-center ga-2">
                    <span class="font-weight-bold text-no-wrap">最後交貨日期：</span>

                    <v-date-input
                      v-model="cdsForm.lastDeliveryDate"
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

                    <span class="text-body-2">（未填者自開狀日起三個月視為最後交貨日）。</span>
                  </div>

                  <div class="mt-4">
                    <div class="font-weight-bold mb-2">
                      其他：
                    </div>

                    <v-textarea
                      v-model="cdsForm.otherSpecialTerms"
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
            </tbody>
          </v-table>

          <!-- ================================================================
               FPC 表格
          ================================================================ -->
          <v-table v-if="beneType === 'fpc'" class="table-sm hnb__table-v bg-white" density="compact">
            <tbody>
              <tr>
                <th class="text-end text-no-wrap" scope="row" style="width: 150px;">
                  申請人：
                </th>

                <td class="lc-td">
                  <v-text-field
                    v-model="fpcForm.applicantName"
                    color="teal-darken-2"
                    density="compact"
                    hide-details="auto"
                    variant="outlined"
                  />
                </td>
              </tr>

              <tr>
                <th class="text-end text-no-wrap" scope="row">
                  申請人統一編號：
                </th>

                <td class="lc-td">
                  <div class="d-flex align-center ga-2 flex-wrap">
                    <v-text-field
                      v-model="fpcForm.applicantTaxId"
                      color="teal-darken-2"
                      density="compact"
                      hide-details="auto"
                      maxlength="8"
                      style="max-width: 200px"
                      variant="outlined"
                    />

                    <v-btn class="mx-1 hnb__btn--default" @click="lookupApplicant">
                      查詢
                    </v-btn>
                  </div>
                </td>
              </tr>

              <tr>
                <th class="text-end text-no-wrap" scope="row">
                  申請人聯絡人姓名：
                </th>

                <td class="lc-td">
                  <v-text-field
                    v-model="fpcForm.contactName"
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
                    v-model="fpcForm.contactPhone"
                    color="teal-darken-2"
                    density="compact"
                    hide-details="auto"
                    variant="outlined"
                  />
                </td>
              </tr>

              <tr>
                <th class="text-end text-no-wrap" scope="row">
                  金額：
                </th>

                <td class="lc-td">
                  <div class="d-flex align-center ga-2 flex-wrap">
                    <span class="text-nowrap">新台幣</span>

                    <v-text-field
                      v-model="fpcForm.amount"
                      class="flex-grow-1"
                      color="teal-darken-2"
                      density="compact"
                      hide-details="auto"
                      style="min-width: 120px"
                      variant="outlined"
                    />

                    <span class="text-nowrap">元整</span>
                  </div>
                </td>
              </tr>

              <tr>
                <th class="text-end text-no-wrap" scope="row">
                  有效期限至：<br>
                  <span class="text-caption">（未填者自開狀日三個月視為最後有效期限）</span>
                </th>

                <td class="lc-td">
                  <v-date-input
                    v-model="fpcForm.expiryDate"
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
                  通知銀行：（如有需要指定銀行時請填上）
                </th>

                <td class="lc-td">
                  <v-select
                    v-model="fpcForm.noticeBank"
                    clearable
                    color="teal-darken-2"
                    density="compact"
                    hide-details="auto"
                    item-title="title"
                    item-value="value"
                    :items="[...FPC_NOTICE_BANK_ITEMS]"
                    placeholder="請選擇"
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
                    v-model="fpcForm.beneCorp"
                    class="mb-2"
                    clearable
                    color="teal-darken-2"
                    density="compact"
                    hide-details="auto"
                    item-title="title"
                    item-value="value"
                    :items="[...FPC_BENE_ITEMS]"
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
                <th class="text-end text-no-wrap" scope="row">
                  受益人電話：
                </th>

                <td class="lc-td">
                  <v-text-field
                    v-model="fpcForm.benePhone"
                    color="teal-darken-2"
                    density="compact"
                    hide-details="auto"
                    variant="outlined"
                  />
                </td>
              </tr>

              <tr>
                <th class="text-end text-no-wrap" scope="row">
                  受益人電子信箱：
                </th>

                <td class="lc-td">
                  <v-text-field
                    v-model="fpcForm.beneEmail"
                    color="teal-darken-2"
                    density="compact"
                    hide-details="auto"
                    variant="outlined"
                  />
                </td>
              </tr>

              <tr>
                <th class="text-end text-no-wrap" scope="row">
                  受益人事業部：
                </th>

                <td class="lc-td">
                  <v-select
                    v-model="fpcForm.department"
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
                    v-model="fpcForm.customerNo"
                    color="teal-darken-2"
                    density="compact"
                    hide-details="auto"
                    variant="outlined"
                  />
                </td>
              </tr>

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
                  {{ payerBankLabel }}
                </td>
              </tr>

              <tr>
                <th class="text-end text-no-wrap align-top" scope="row">
                  乙、付款期限：
                </th>

                <td class="lc-td">
                  <v-radio-group
                    v-model="fpcForm.paymentKind"
                    color="cyan-darken-3"
                    density="compact"
                    hide-details="auto"
                  >
                    <v-radio label="見票即付。" value="sight" />

                    <v-radio value="fixed">
                      <template #label>
                        <span>以「定日付款」方式填寫到期日，其到期日為：</span>
                      </template>
                    </v-radio>
                  </v-radio-group>

                  <div v-if="fpcForm.paymentKind === 'fixed'" class="ml-4 mt-2">
                    <v-radio-group
                      v-model="fpcForm.fixedExpiryBasis"
                      color="cyan-darken-3"
                      density="compact"
                      hide-details="auto"
                    >
                      <v-radio label="匯票發票日" value="draft_invoice" />
                      <v-radio label="統一發票日" value="unified_invoice" />
                    </v-radio-group>

                    <div class="d-flex align-center ga-2 flex-wrap mt-2">
                      <span>起算</span>

                      <v-text-field
                        v-model="fpcForm.fixedDaysWithin"
                        density="compact"
                        hide-details="auto"
                        style="max-width: 72px"
                        variant="outlined"
                      />

                      <span>天內。</span>
                    </div>

                    <div class="d-flex align-center ga-2 flex-wrap mt-3">
                      <v-checkbox
                        v-model="fpcForm.useNamedDueDate"
                        color="cyan-darken-3"
                        density="compact"
                        hide-details
                        label="指定期日為"
                      />

                      <v-date-input
                        v-model="fpcForm.namedDueDate"
                        append-inner-icon="mdi-calendar"
                        bg-color="white"
                        color="teal-darken-2"
                        density="compact"
                        :disabled="!fpcForm.useNamedDueDate"
                        hide-details="auto"
                        placeholder="例：2026/01/01"
                        prepend-icon=""
                        style="max-width: 220px"
                        variant="outlined"
                      />
                    </div>
                  </div>
                </td>
              </tr>

              <tr>
                <th class="text-end text-no-wrap" scope="row">
                  丙、金額：
                </th>

                <td class="lc-td text-body-2">
                  須與相關發票上所列開金額一致或依照本信用狀其他指示。
                </td>
              </tr>

              <tr>
                <td class="lc-td font-weight-bold" colspan="2">
                  二、應檢附之單證如下：
                </td>
              </tr>

              <tr>
                <th class="text-end text-no-wrap" scope="row" />

                <td class="lc-td">
                  <div class="text-body-2 mb-2">
                    1. 匯票承兌/付款申請書乙份。
                  </div>

                  <div class="d-flex align-center flex-wrap ga-2 mb-2">
                    <span>2.</span>

                    <v-radio-group
                      v-model="fpcForm.invoiceDocKind"
                      color="cyan-darken-3"
                      density="compact"
                      hide-details="auto"
                      inline
                    >
                      <v-radio label="發票" value="invoice" />
                      <v-radio label="或統一發票" value="unified" />
                    </v-radio-group>
                  </div>

                  <div class="mb-2">
                    <div class="mb-1">
                      3. 其他（請註明）：
                    </div>

                    <v-textarea
                      v-model="fpcForm.otherDocumentsNote"
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
                      v-model="fpcForm.productDescriptionNote"
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
                <th class="text-end text-no-wrap align-top" scope="row">
                  特別指示：
                </th>

                <td class="lc-td text-body-2">
                  <p>1. 匯票及匯票付款申請書使用受益人所訂格式，由受益人單獨簽章或使用數位憑證有效。</p>
                  <p>2. 貨物可以分批交貨。</p>

                  <div class="d-flex flex-wrap align-center ga-2 my-2">
                    <span>3. 最後交貨日期：</span>

                    <v-date-input
                      v-model="fpcForm.lastDeliveryDate"
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

                    <span>（未填者自開狀日起三個月視為最後交貨日，惟不得超過信用狀有效日期）。</span>
                  </div>

                  <p>4. 發票日期早於開狀日期可以接受。</p>
                  <p>5. 發票金額大於開狀金額或匯票金額可以接受。</p>
                  <p>6. 以受益人所屬分公司或分廠名義開立之發票押匯可以接受。</p>
                  <p>7. 本信狀適用 eUCP2.0 版。</p>
                  <p>8. 允許受益人以匯票、匯票付款申請書及發票電子檔方式押匯。</p>
                  <p>9. 押匯電子文件透過網址: HTTPS://ecrm.fpg.com.tw 提示。</p>

                  <div class="d-flex align-center ga-2 my-2">
                    <span>10. 遠期信用狀利息：</span>

                    <v-checkbox
                      v-model="fpcForm.usanceInterestBuyer"
                      color="cyan-darken-3"
                      density="compact"
                      hide-details
                      label="買方負擔"
                    />
                  </div>

                  <div class="my-2">
                    <div class="mb-1">
                      11. 其他：
                    </div>

                    <v-textarea
                      v-model="fpcForm.otherSpecialTerms"
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
                      v-model="fpcForm.draftStartDate"
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

                    <span>起始可押匯。（未填寫者視為未限定押匯日期）</span>
                  </div>

                  <div class="d-flex flex-wrap align-center ga-2 my-2">
                    <span>13. 發票起始開立日期：</span>

                    <v-date-input
                      v-model="fpcForm.invoiceStartDate"
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

                    <span>。（以統一發票日起算匯票到其日期者，請填寫此項，未填寫者視為未限制發票開立日期）</span>
                  </div>
                </td>
              </tr>

              <tr>
                <td class="lc-td text-body-2" colspan="2">
                  <p class="mb-2">
                    <span class="font-weight-bold">利率約款：</span>
                    貴行依本申請書開發信用狀所墊付之款項，申請人同意按貴我雙方所訂之利率訂價指標，按月計付利息。
                  </p>

                  <div>
                    <div class="d-flex align-center flex-wrap ga-2 my-2">
                      <v-checkbox
                        v-model="fpcForm.rateBaseChecked"
                        color="cyan-darken-3"
                        density="compact"
                        hide-details
                      />

                      <span>基準利率 加碼年率</span>

                      <v-text-field
                        v-model="fpcForm.rateBaseSpread"
                        color="teal-darken-2"
                        density="compact"
                        :disabled="!fpcForm.rateBaseChecked"
                        hide-details="auto"
                        style="max-width: 72px"
                        variant="outlined"
                      />

                      <span>% 計付利息，如貴行利率調整時亦隨同調整。</span>
                    </div>

                    <div class="d-flex align-center flex-wrap ga-2 my-2">
                      <v-checkbox
                        v-model="fpcForm.rateFixedChecked"
                        color="cyan-darken-3"
                        density="compact"
                        hide-details
                      />

                      <span>年率</span>

                      <v-text-field
                        v-model="fpcForm.rateFixedPercent"
                        color="teal-darken-2"
                        density="compact"
                        :disabled="!fpcForm.rateFixedChecked"
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

                  <p>
                    貴行依本申請書開發「利息及承兌手續費由賣方負擔」之遠期信用狀，如於信用狀有效期限屆滿而受益人未向貴行辦理承兌或申請人申請註銷信用狀時，申請人同意依開狀金額，視信用狀有效期限以三個月為一期(未滿三個月者視為一期)，按年率
                    0.1% 補繳開狀手續費。
                  </p>

                  <p>
                    貴行依本申請書開發「利息由買方負擔」之遠期信用狀，如有下列情形之ㄧ者，申請人同意依押匯金額及信用狀有效期限（三個月為一期，未滿三個月者視為一期），按年率 0.1%
                    補繳開狀手續費，最低金額為新台幣 1,000 元：<br>
                    (1) 受益人押匯後，申請人立即還款而未向貴行借款者。<br>
                    (2) 申請人提前清償借款，其利息加計原開狀手續費（分批押匯改貸，以第一筆押匯金額計算）合計低於新台幣 1,000 元者。
                  </p>
                </td>
              </tr>
            </tbody>
          </v-table>

          <!-- ================================================================
               Other 表格
          ================================================================ -->
          <v-table v-if="beneType === 'other'" class="table-sm hnb__table-v bg-white" density="compact">
            <tbody>
              <tr>
                <th class="text-end text-no-wrap" scope="row" style="width: 150px;">
                  申請人：
                </th>

                <td class="lc-td">
                  <v-text-field
                    v-model="otherForm.applicantName"
                    color="teal-darken-2"
                    density="compact"
                    hide-details="auto"
                    variant="outlined"
                  />
                </td>
              </tr>

              <tr>
                <th class="text-end text-no-wrap" scope="row">
                  申請人統一編號：
                </th>

                <td class="lc-td">
                  <v-text-field
                    v-model="otherForm.applicantTaxId"
                    color="teal-darken-2"
                    density="compact"
                    hide-details="auto"
                    maxlength="8"
                    style="max-width: 200px"
                    variant="outlined"
                  />
                </td>
              </tr>

              <tr>
                <th class="text-end text-no-wrap" scope="row">
                  金額：
                </th>

                <td class="lc-td">
                  <div class="d-flex align-center ga-2 flex-wrap">
                    <v-select
                      v-model="otherForm.currency"
                      color="teal-darken-2"
                      density="compact"
                      hide-details="auto"
                      item-title="title"
                      item-value="value"
                      :items="[...OTHER_CURRENCY_OPTIONS]"
                      style="max-width: 120px"
                      variant="outlined"
                    />

                    <v-text-field
                      v-model="otherForm.amount"
                      class="flex-grow-1"
                      color="teal-darken-2"
                      density="compact"
                      hide-details="auto"
                      style="min-width: 120px"
                      variant="outlined"
                    />

                    <span class="text-nowrap">元整</span>
                  </div>
                </td>
              </tr>

              <tr>
                <th class="text-end text-no-wrap" scope="row">
                  有效期限至：<br>
                  <span class="text-caption">（未填者自開狀日三個月視為最後有效期限）</span>
                </th>

                <td class="lc-td">
                  <v-date-input
                    v-model="otherForm.expiryDate"
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
                  通知銀行：（如有需要指定銀行時請填上）
                </th>

                <td class="lc-td">
                  <v-select
                    v-model="otherForm.noticeBank"
                    clearable
                    color="teal-darken-2"
                    density="compact"
                    hide-details="auto"
                    item-title="title"
                    item-value="value"
                    :items="[...OTHER_NOTICE_BANK_ITEMS]"
                    placeholder="請選擇"
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
                    v-model="otherForm.beneCorp"
                    class="mb-2"
                    clearable
                    color="teal-darken-2"
                    density="compact"
                    hide-details="auto"
                    item-title="title"
                    item-value="value"
                    :items="[...OTHER_BENE_ITEMS]"
                    placeholder="請選擇受益人名稱"
                    variant="outlined"
                  />

                  <div class="d-flex align-center ga-2 mb-2">
                    <span class="text-nowrap text-end" style="width: 80px">統一編號：</span>

                    <v-text-field
                      color="teal-darken-2"
                      density="compact"
                      hide-details="auto"
                      :model-value="otherSelectedBene?.taxId ?? ''"
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
                      :model-value="otherSelectedBene?.corpName ?? ''"
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
                  <v-text-field
                    v-model="otherForm.managerName"
                    color="teal-darken-2"
                    density="compact"
                    hide-details="auto"
                    variant="outlined"
                  />
                </td>
              </tr>

              <tr>
                <th class="text-end text-no-wrap" scope="row">
                  負責人職稱：
                </th>

                <td class="lc-td">
                  <v-text-field
                    v-model="otherForm.managerTitle"
                    color="teal-darken-2"
                    density="compact"
                    hide-details="auto"
                    variant="outlined"
                  />
                </td>
              </tr>

              <tr>
                <th class="text-end text-no-wrap" scope="row">
                  受益人地址：
                </th>

                <td class="lc-td">
                  <v-text-field
                    v-model="otherForm.beneAddress"
                    color="teal-darken-2"
                    density="compact"
                    hide-details="auto"
                    variant="outlined"
                  />
                </td>
              </tr>

              <tr>
                <th class="text-end text-no-wrap" scope="row">
                  受益人電話：
                </th>

                <td class="lc-td">
                  <v-text-field
                    v-model="otherForm.benePhone"
                    color="teal-darken-2"
                    density="compact"
                    hide-details="auto"
                    variant="outlined"
                  />
                </td>
              </tr>

              <tr>
                <th class="text-end text-no-wrap" scope="row">
                  受益人電子信箱：
                </th>

                <td class="lc-td">
                  <v-text-field
                    v-model="otherForm.beneEmail"
                    color="teal-darken-2"
                    density="compact"
                    hide-details="auto"
                    variant="outlined"
                  />
                </td>
              </tr>

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
                  {{ payerBankLabel }}
                </td>
              </tr>

              <tr>
                <th class="text-end text-no-wrap align-top" scope="row">
                  乙、付款期限：
                </th>

                <td class="lc-td">
                  <v-radio-group
                    v-model="otherForm.paymentMain"
                    color="cyan-darken-3"
                    density="compact"
                    hide-details="auto"
                  >
                    <v-radio label="見票即付。" value="sight" />

                    <v-radio value="fixed">
                      <template #label>
                        <span>以「定日付款」方式填寫到期日，其到期日為：</span>
                      </template>
                    </v-radio>
                  </v-radio-group>

                  <div v-if="otherForm.paymentMain === 'fixed'" class="ml-4 mt-2">
                    <v-radio-group
                      v-model="otherForm.paymentExpBasis"
                      color="cyan-darken-3"
                      density="compact"
                      hide-details="auto"
                    >
                      <v-radio label="匯票發票日" value="draft" />
                      <v-radio label="（統一）發票日" value="invoice" />

                      <v-radio value="other">
                        <template #label>
                          <div class="d-flex align-center ga-2 flex-wrap">
                            <span>其他：</span>

                            <v-text-field
                              v-model="otherForm.paymentExpOtherText"
                              color="teal-darken-2"
                              density="compact"
                              :disabled="otherForm.paymentExpBasis !== 'other'"
                              hide-details="auto"
                              style="min-width: 200px"
                              variant="outlined"
                            />
                          </div>
                        </template>
                      </v-radio>
                    </v-radio-group>

                    <div class="d-flex align-center ga-2 flex-wrap mt-2">
                      <span>起算</span>

                      <v-text-field
                        v-model="otherForm.payDaysAfter"
                        color="teal-darken-2"
                        density="compact"
                        hide-details="auto"
                        style="max-width: 56px"
                        variant="outlined"
                      />

                      <span>天內。</span>
                    </div>
                  </div>
                </td>
              </tr>

              <tr>
                <th class="text-end text-no-wrap" scope="row">
                  丙、金額：
                </th>

                <td class="lc-td text-body-2">
                  須與相關發票上所列開金額一致。
                </td>
              </tr>

              <tr>
                <td class="lc-td font-weight-bold" colspan="2">
                  二、應檢附之單證如下：
                </td>
              </tr>

              <tr>
                <th class="text-end text-no-wrap" scope="row" />

                <td class="lc-td">
                  <div class="text-body-2 mb-2">
                    1. 匯票承兌/付款申請書乙份。
                  </div>

                  <div class="d-flex align-center flex-wrap ga-2 mb-2">
                    <span>2.</span>

                    <v-radio-group
                      v-model="otherForm.invoiceKind"
                      color="cyan-darken-3"
                      density="compact"
                      hide-details="auto"
                      inline
                    >
                      <v-radio label="發票" value="invoice" />
                      <v-radio label="統一發票" value="unified" />
                    </v-radio-group>
                  </div>

                  <div class="mb-2">
                    <div class="mb-1">
                      3. 其他（請註明）：
                    </div>

                    <v-textarea
                      v-model="otherForm.otherDocumentsDetail"
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
                      v-model="otherForm.productPurchaseNote"
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
                  特別指示：
                </th>

                <td>
                  <div class="mb-3 d-inline-flex align-center">
                    <span>1. 匯票承兌/付款申請書使用</span>

                    <v-radio-group
                      v-model="otherForm.draftFormat"
                      class="d-inline-flex"
                      color="cyan-darken-3"
                      density="compact"
                      hide-details="auto"
                      inline
                    >
                      <v-radio label="貴行" value="bank" />
                      <v-radio label="受益人" value="beneficiary" />
                    </v-radio-group>

                    <span>所訂格式，申請書上信用狀申請人所蓋印鑑應與原留印鑑相符。</span>
                  </div>

                  <div class="mb-3 d-inline-flex align-center">
                    <span>2. 分批交貨：</span>

                    <v-radio-group
                      v-model="otherForm.partialShipment"
                      class="d-inline-flex"
                      color="cyan-darken-3"
                      density="compact"
                      hide-details="auto"
                      inline
                    >
                      <v-radio label="可以" value="allowed" />
                      <v-radio label="不可以" value="not_allowed" />
                    </v-radio-group>

                    <span>（未填者視為得分批交貨）。</span>
                  </div>

                  <div class="mb-3 d-inline-flex align-center">
                    <span>3.</span>

                    <v-radio-group
                      v-model="otherForm.discountInterest"
                      class="d-inline-flex"
                      color="cyan-darken-3"
                      density="compact"
                      hide-details="auto"
                      inline
                    >
                      <v-radio label="匯票墊款利息由買方負擔" value="buyer" />
                      <v-radio label="匯票貼現利息由賣方負擔" value="seller" />
                    </v-radio-group>

                    <span>（未填者視為由買方負擔）。</span>
                  </div>

                  <div class="d-flex flex-wrap align-center ga-2 mb-3">
                    <span>4. 最後交貨日期：</span>

                    <v-date-input
                      v-model="otherForm.lastDeliveryDate"
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

                    <span>（未填者自開狀日起三個月視為最後交貨日，惟不得超過信用狀有效期限）。</span>
                  </div>

                  <div class="d-flex flex-wrap align-center ga-2 mb-3">
                    <span>5. 限定押匯日期：自</span>

                    <v-date-input
                      v-model="otherForm.draftLimitStartDate"
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

                    <span>起始可押匯。</span>
                  </div>

                  <div class="mb-3 d-inline-flex align-center">
                    <span>6. 承兌手續費由</span>

                    <v-radio-group
                      v-model="otherForm.feeBearer"
                      class="d-inline-flex"
                      color="cyan-darken-3"
                      density="compact"
                      hide-details="auto"
                      inline
                    >
                      <v-radio label="買方" value="buyer" />
                      <v-radio label="賣方" value="seller" />
                    </v-radio-group>

                    <span>負擔（未填者視為由買方負擔）。</span>
                  </div>

                  <div class="mb-3 d-inline-flex align-center">
                    <span>7. 受益人押匯時，匯票承兌/付款申請書</span>

                    <v-radio-group
                      v-model="otherForm.stampSingleParty"
                      class="d-inline-flex"
                      color="cyan-darken-3"
                      density="compact"
                      hide-details="auto"
                      inline
                    >
                      <v-radio label="可以" value="allowed" />
                      <v-radio label="不可以" value="not_allowed" />
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
                      v-model="otherForm.otherSpecialTerms"
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

              <tr>
                <td colspan="2">
                  <p class="mb-2 d-flex flex-wrap align-center ga-1">
                    <span class="font-weight-bold">利率條款：</span>
                    <span>貴行依本申請書開發信用狀所墊付之款項，申請人同意依貴我雙方所訂之利率訂價方式，自墊款日起每月</span>

                    <v-text-field
                      v-model="otherForm.ratePaymentDayOfMonth"
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
                    <li>
                      1. 貴行依本申請書開發「利息及承兌手續費由賣方負擔」之遠期信用狀，如於信用狀有效期限屆滿而受益人未向貴行辦理承兌或申請人申請註銷信用狀時，申請人同意依開狀金額，視信用狀有效期限以三個月為一期(未滿三個月者視為一期)，按年率
                      0.1% 補繳開狀手續費。
                    </li>

                    <li>
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
      v-if="beneType === 'cds'"
      v-model:app-dialog="appDialog"
      :app-no="appNo"
      @on-close="appDialogClose"
    />

    <AppForFpcDialog
      v-if="beneType === 'fpc'"
      v-model:app-dialog="appDialog"
      :app-no="appNo"
      @on-close="appDialogClose"
    />

    <AppForOtherDialog
      v-if="beneType === 'other'"
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
  import type { BeneTypeOption } from '@/types/amendQuery'
  import type { LcAppData, LcCdsApplicationPayload } from '@/types/lcCdsApplication'
  import type { FpcBeneOption, LcFpcApplicationPayload } from '@/types/lcFpcApplication'
  import type { LcOtherApplicationPayload, OtherBeneOption } from '@/types/lcOtherApplication'
  import { computed, reactive, ref } from 'vue'
  import { VForm } from 'vuetify/components'
  import {
    createInitialLcCdsForm,
    CURRENCY_OPTIONS,
    DEFAULT_CUSTOM_ELECTRONIC_NOTE,
    NOTICE_BANK_ITEMS,
  } from '@/types/lcCdsApplication'
  import {
    createInitialLcFpcForm,
    FPC_BENE_ITEMS,
    FPC_DEPT_ITEMS,
    FPC_NOTICE_BANK_ITEMS,
  } from '@/types/lcFpcApplication'
  import {
    createInitialLcOtherForm,
    OTHER_BENE_ITEMS,
    OTHER_CURRENCY_OPTIONS,
    OTHER_NOTICE_BANK_ITEMS,
  } from '@/types/lcOtherApplication'

  const props = defineProps<{
    beneType: BeneTypeOption
    formData: LcAppData
  }>()

  const emit = defineEmits<{
    'on-submit': []
    'on-cancel': []
  }>()

  const lcFormRef = ref<InstanceType<typeof VForm> | null>(null)

  // ── CDS 表單 ──────────────────────────────────────────────────────────────
  const cdsForm = reactive<LcCdsApplicationPayload>({
    noticeBank: null,
    lcType: null,
    currency: 'TWD',
    amount: '',
    expiryDate: '',
    beneEmail: '',
    benePhone: '',
    applicantName: '',
    applicantTaxId: '',
    applicantAddress: '',
    goodsDescription: '',
    electronicNote: null,
    customElectronicNote: DEFAULT_CUSTOM_ELECTRONIC_NOTE,
    deliverPaymentRequest: false,
    deliverInvoice: false,
    deliverOther: false,
    deliverOtherDetail: '',
    partialShipment: '',
    lastDeliveryDate: '',
    otherSpecialTerms: '',
  })

  const cdsCustomNoteEditable = computed(() => cdsForm.electronicNote === 'custom')

  // ── FPC 表單 ──────────────────────────────────────────────────────────────
  const fpcForm = reactive<LcFpcApplicationPayload>({
    applicantName: '',
    applicantTaxId: '',
    contactName: '',
    contactPhone: '',
    amount: '',
    expiryDate: '',
    noticeBank: null,
    beneCorp: null,
    benePhone: '',
    beneEmail: '',
    department: null,
    customerNo: '',
    paymentKind: null,
    fixedExpiryBasis: null,
    fixedDaysWithin: '',
    useNamedDueDate: false,
    namedDueDate: '',
    invoiceDocKind: null,
    otherDocumentsNote: '',
    productDescriptionNote: '',
    lastDeliveryDate: '',
    otherSpecialTerms: '',
    usanceInterestBuyer: false,
    draftStartDate: '',
    invoiceStartDate: '',
    rateBaseChecked: false,
    rateBaseSpread: '',
    rateFixedChecked: false,
    rateFixedPercent: '',
  })

  const fpcSelectedBene = computed<FpcBeneOption | null>(() => {
    const v = fpcForm.beneCorp
    if (!v) return null
    return FPC_BENE_ITEMS.find(b => b.value === v) ?? null
  })

  // ── Other 表單 ────────────────────────────────────────────────────────────
  const otherForm = reactive<LcOtherApplicationPayload>({
    applicantName: '',
    applicantTaxId: '',
    currency: 'TWD',
    amount: '',
    expiryDate: '',
    noticeBank: null,
    beneCorp: null,
    managerName: '',
    managerTitle: '',
    beneAddress: '',
    benePhone: '',
    beneEmail: '',
    paymentMain: null,
    paymentExpBasis: null,
    paymentExpOtherText: '',
    payDaysAfter: '',
    invoiceKind: null,
    otherDocumentsDetail: '',
    productPurchaseNote: '',
    draftFormat: null,
    partialShipment: 'allowed',
    discountInterest: null,
    lastDeliveryDate: '',
    draftLimitStartDate: '',
    feeBearer: null,
    stampSingleParty: null,
    otherSpecialTerms: '',
    ratePaymentDayOfMonth: '',
  })

  const otherSelectedBene = computed<OtherBeneOption | null>(() => {
    const v = otherForm.beneCorp
    if (!v) return null
    return OTHER_BENE_ITEMS.find(b => b.value === v) ?? null
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

  // ── CDS 固定常數 ──────────────────────────────────────────────────────────
  const issuingBankLabel = '華南商業銀行 高雄分行'
  const paymentBankLabel = '華南商業銀行 高雄分行'
  const cdsBeneficiaryName = '中國鋼鐵股份有限公司'
  const cdsBeneficiaryAddress = '高雄市小港區中鋼路1號'
  const cdsPaymentTermsText = '見票即付。'

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
  const payerBankLabel = '華南商業銀行 台北分行'

  const introItems = [
    '茲請　貴行准照前訂委任開發國內信用狀契約之約定依下開條件開發信用狀。',
    '本信用狀規定如有未盡事宜適用國際商會所訂現行「信用狀統一慣例與實務」之規定。',
  ] as const

  // ── 監聽 formData 以初始化 / 重設表單 ─────────────────────────────────────
  watch(
    () => props.formData,
    newData => {
      const { type, appNo: no } = newData as LcAppData
      if (type === 'edit' && no) {
        if (props.beneType === 'cds') Object.assign(cdsForm, createInitialLcCdsForm())
        else if (props.beneType === 'fpc') Object.assign(fpcForm, createInitialLcFpcForm())
        else Object.assign(otherForm, createInitialLcOtherForm())
      } else if (type === 'new') {
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
    message.value = '確定要離開填寫畫面？未儲存的資料將遺失。'
    messageStatus.value = 'alert'
    processStatus.value = 'cancel'
    isConfirmBtn.value = true
    messageDialog.value = true
  }

  function onSubmit (): void {
    const payload = props.beneType === 'cds' ? cdsForm
      : props.beneType === 'fpc' ? fpcForm
        : otherForm
    console.log('Submit payload:', payload)
    try {
      emit('on-submit')
    } catch (error) {
      console.error('Error emitting submit event:', error)
    }
  }

  function messageConfirm (): void {
    if (processStatus.value === 'cancel') emit('on-cancel')
    messageDialog.value = false
  }

  function messageClose (): void {
    messageDialog.value = false
  }

  function appDialogClose (): void {
    appDialog.value = false
    appNo.value = ''
  }
</script>
