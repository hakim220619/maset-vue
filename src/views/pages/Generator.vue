<script setup>
import { ref } from 'vue';
import SetupColumn from './generator/SetupColumn.vue';

const form = ref({
    name: '',
    tableName: '',
    columns: []
});
</script>

<template>
    <Stepper value="1">
        <StepList>
            <Step value="1">Setup Table</Step>
            <Step value="2">Setup Column</Step>
            <Step value="3">Header III</Step>
        </StepList>

        <div class="card mt-6">
            <StepPanels>
                <StepPanel v-slot="{ activateCallback }" value="1">
                    <div class="">
                        <div class="font-semibold text-xl mb-4">Generator Page</div>
                        <p>Use this page to start from scratch and place your custom content.</p>

                        <div class="mt-12 mb-6 space-y-4">
                            <div class="grid grid-cols-4">
                                <label for="">Name</label>
                                <InputText v-model="form.name" class="col-span-2"></InputText>
                            </div>

                            <div class="grid grid-cols-4">
                                <label for="">Table Name</label>
                                <InputText v-model="form.tableName" class="col-span-2"></InputText>
                            </div>
                        </div>
                    </div>

                    <div class="flex pt-6 justify-end">
                        <Button label="Next" icon="pi pi-arrow-right" iconPos="right" @click="activateCallback('2')" />
                    </div>
                </StepPanel>

                <StepPanel v-slot="{ activateCallback }" value="2">
                    <SetupColumn v-model:columns="form.columns" @prev="activateCallback('1')" @next="activateCallback('3')"></SetupColumn>
                </StepPanel>

                <StepPanel v-slot="{ activateCallback }" value="3">
                    <div class="flex flex-col h-48">
                        <div class="border-2 border-dashed border-surface-200 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-950 flex-auto flex justify-center items-center font-medium">Content III</div>
                    </div>
                    <div class="pt-6">
                        <Button label="Back" severity="secondary" icon="pi pi-arrow-left" @click="activateCallback('2')" />
                    </div>
                </StepPanel>
            </StepPanels>
        </div>
    </Stepper>
</template>
