<template>
<div>
    <div v-for="frame in content.homepage.widgets" :key="frame.widgetId" class="v-col--auto">
    <div class="card">
        <div class="card-header">
            <h3>{{frame.label || (frame.item && frame.item.name)}}</h3>
        </div>

        <vddl-list class="list-group list-group-flush" :list="frame.widgets" :horizontal="false">
            <vddl-draggable class="list-group-item" v-for="(widget, index) in frame.widgets" :key="widget.widgetId"
            :draggable="widget"
            :index="index"
            :wrapper="frame.widgets"
            effect-allowed="move">
            {{widget.label}}
            </vddl-draggable>
            <vddl-placeholder class="list-group-item red">Custom placeholder</vddl-placeholder>
        </vddl-list>

    </div>
    </div>
</div>
</template>

<style lang="scss">
.vddl-list, .vddl-draggable {
  position: relative;
}

.vddl-list {
  min-height: 44px;
}

.vddl-dragging {
  opacity: 0.7;
}

.vddl-dragging-source {
  display: none;
}
</style>


<script>
import Vddl from "vddl";
import Vue from "vue";

Vue.use(Vddl);

export default {

};
</script>
