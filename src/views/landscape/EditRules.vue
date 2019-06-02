<style lang="scss" scoped>
.edit-rules-container{ 
    pre{
        border: 1px solid lightgray;
        min-height: 150px;
    }
}
</style>
<template>
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        <template v-slot:activator="{ on }">
            <v-btn color="primary" dark v-on="on">Edit Rules</v-btn>
        </template>
        <v-card>
            <v-toolbar dark color="primary">
                <v-btn icon dark @click="close">
                    <v-icon>close</v-icon>
                </v-btn>
                <v-toolbar-title>Edit Rules</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                    <v-btn dark flat @click="save">Save</v-btn>
                </v-toolbar-items>
            </v-toolbar>
            <v-container fluid grid-list-xl>
                <v-layout row wrap>
                    <v-flex xs12>
                        <h1>User Edit Rules</h1> 
                        <v-btn color="primary" @click="newRuleset" v-show="!rulesetBuilder" >Add New Rulset</v-btn>
                        <v-btn color="error" @click="cancelRuleset" v-show="rulesetBuilder" >Cancel New Rulset</v-btn>
                        <v-btn color="success" @click="saveRuleset" v-show="rulesetBuilder" >Save Ruleset</v-btn>
                    </v-flex> 

                    <v-flex v-show="!rulesetBuilder" xs12 sm6  class="edit-rules-container">
                        <h3>Full Edit Rules JSON</h3>
                        <pre>{{ editRules }}</pre>
                    </v-flex>
                    <v-flex v-show="!rulesetBuilder"  xs12 sm6 >
                        <h4>Edit Rules</h4> 
                        <div v-for="(rule,index) in editRules.edit" :key="index"> 
                            <h3>If</h3>
                            <ul>
                                <li v-for="(part,index) in rule.condition" :key="index">
                                    {{ part.attribute | formatEditAttribute }} is {{ part.operator | formatEditOperator }} {{ part.value }}
                                    <span class="font-weight-bold" v-if="index < workingEditRules.edit.condition.length - 1">AND</span>  
                                </li>
                            </ul>
                            <h3 v-show="rule.change.length">Then</h3>
                            <ul>
                                <li v-for="(part,index) in rule.change" :key="index">
                                    {{ part.attribute | formatEditAttribute }} is {{ part.operator | formatChangeOperator }} {{ part.value }}
                                    <span class="font-weight-bold" v-if="index < workingEditRules.edit.change.length - 1">AND</span>  
                                </li>
                            </ul>
                            <v-btn small block color="warning" @click="removeRule(index)">Remove Rule</v-btn>
                        </div>
                    </v-flex>


                    <v-flex v-show="rulesetBuilder" xs12 sm6 class="edit-rules-container">
                        <h3>Working Edit Rules JSON</h3>
                        <pre>{{ workingEditRules }}</pre>
                    </v-flex>

                    <v-flex  v-show="rulesetBuilder"  xs12 sm6 >
                        <h4>Working Edit Rules</h4> 
                         <h3 v-show="workingEditRules.edit.condition.length">If</h3>
                        <ul>
                            <li v-for="(part,index) in workingEditRules.edit.condition" :key="index">
                                {{ part.attribute | formatEditAttribute }} is {{ part.operator | formatEditOperator }} {{ part.value }}
                                <span class="font-weight-bold" v-if="index < workingEditRules.edit.condition.length - 1">AND</span>  
                                <v-icon color="error" small class="pointer" @click="removeCondition(index)">delete</v-icon>  
                            </li>
                        </ul>
                        <h3 v-show="workingEditRules.edit.change.length">Then</h3>
                        <ul>
                            <li v-for="(part,index) in workingEditRules.edit.change" :key="index">
                                {{ part.attribute | formatEditAttribute }} is {{ part.operator | formatChangeOperator }} {{ part.value }}
                                <span class="font-weight-bold" v-if="index < workingEditRules.edit.change.length - 1">AND</span>  
                                <v-icon color="error" small class="pointer" @click="removeChange(index)">delete</v-icon>  
                            </li>
                        </ul>
                    </v-flex>
                    <v-expand-transition> 
                        <v-flex xs12 v-show="rulesetBuilder">
                            <v-card>  
                                <v-toolbar>
                                    <v-toolbar-title>Condition Builder</v-toolbar-title>
                                    <v-spacer/> 
                                    <v-btn flat @click="conditionBuilderSubmit($v)">
                                        Add<v-icon>add_to_photos</v-icon>
                                    </v-btn>
                                </v-toolbar>
                                
                                <v-form v-on:submit.prevent="conditionBuilderSubmit($v)"> 
                                    <v-layout column class="pt-2">
                                        <v-container fluid grid-list-xl>
                                            <v-layout wrap align-center>
                                                <v-flex xs12 sm5 >
                                                    <v-select 
                                                        dense
                                                        :items="userEditAttributes"
                                                        label="Condition Attribute"
                                                        outline
                                                        clearable
                                                        v-model.trim="$v.conditionEditAttribute.$model"
                                                        :error-messages="conditionEditAttributeErrors" 
                                                    ></v-select>
                                                </v-flex>
                                                <v-flex xs12 sm2 >
                                                    <v-select
                                                        :items="conditionOperatorAttributes"
                                                        label="Operator"
                                                        outline 
                                                        clearable 
                                                        v-model.trim="$v.conditionEditOperator.$model"
                                                        :error-messages="conditionEditOperatorErrors" 
                                                    />
                                                </v-flex>
                                                <v-flex xs12 sm5 > 
                                                    <!-- Fuel Model Selects -->
                                                    <v-select
                                                        v-show="fmType == 13 && conditionEditAttribute == 'fm'"
                                                        dense
                                                        :items="FBFM13"
                                                        :label=conditionAttributeInputLabel
                                                        outline
                                                        clearable 
                                                        v-model.number="$v.conditionEditValue.$model"
                                                        :error-messages="conditionEditValueErrors" 
                                                    ></v-select>
                                                    <v-select
                                                        v-show="fmType == 40 && conditionEditAttribute == 'fm'"
                                                        dense
                                                        :items="FBFM40"
                                                        :label=conditionAttributeInputLabel
                                                        outline
                                                        clearable
                                                        v-model.number="$v.conditionEditValue.$model"
                                                        :error-messages="conditionEditValueErrors" 
                                                    ></v-select>
                                                    <!-- Other Inputs -->
                                                    <v-text-field
                                                        :label=conditionAttributeInputLabel
                                                        v-show="!empty(conditionEditAttribute) && conditionEditAttribute != 'fm'"
                                                        dense
                                                        :hint="conditionAttributeInputHints" 
                                                        v-model.number="$v.conditionEditValue.$model"
                                                        :error-messages="conditionEditValueErrors"  
                                                    ></v-text-field>
                                                </v-flex>
                                            </v-layout>
                                        </v-container>
                                        <v-flex xs12>
                                            <!-- <v-btn :loading="loading" block type="submit" class="blue darken-4 white--text" >Add Rule</v-btn> -->
                                        </v-flex>
                                    </v-layout>
                                </v-form>
                            </v-card>
                            <v-card>  
                                <v-toolbar>
                                    <v-toolbar-title>Condition Change Builder</v-toolbar-title>
                                    <v-spacer/> 
                                    <v-btn flat @click="conditionChangeBuilderSubmit($v)">
                                        Add<v-icon>add_to_photos</v-icon>
                                    </v-btn>
                                </v-toolbar>
                                <v-form v-on:submit.prevent="conditionChangeBuilderSubmit($v)"> 
                                    <v-layout column class="pt-2">
                                        <v-container fluid grid-list-xl>
                                            <v-layout wrap align-center>
                                                <v-flex xs12 sm5 >
                                                    <v-select 
                                                        dense
                                                        :items="userChangeAttributes"
                                                        label="Condition Attribute"
                                                        outline
                                                        clearable
                                                        v-model.trim="$v.conditionChangeAttribute.$model"
                                                        :error-messages="conditionChangeAttributeErrors" 
                                                    ></v-select>
                                                </v-flex>
                                                <v-flex xs12 :sm2="conditionChangeOperator != 'cv'"  :sm7="conditionChangeOperator == 'cv'">
                                                    <v-select
                                                        :items="changeOperatorAttributes"
                                                        label="Operator"
                                                        outline 
                                                        clearable 
                                                        v-model.trim="$v.conditionChangeOperator.$model"
                                                        :error-messages="conditionChangeOperatorErrors" 
                                                    />
                                                </v-flex>
                                                <v-flex xs12 sm5 > 
                                                    <!-- Fuel Model Selects -->
                                                    <v-select
                                                        v-show="fmType == 13 && conditionChangeAttribute == 'fm' && conditionChangeOperator != 'cv'"
                                                        dense
                                                        :items="FBFM13"
                                                        :label=changeAttributeInputLabel
                                                        outline
                                                        clearable 
                                                        v-model.number="$v.conditionChangeValue.$model"
                                                        :error-messages="conditionChangeValueErrors" 
                                                        
                                                    ></v-select>
                                                    <v-select
                                                        v-show="fmType == 40 && conditionChangeAttribute == 'fm' && conditionChangeOperator != 'cv'"
                                                        dense
                                                        :items="FBFM40"
                                                        :label=changeAttributeInputLabel
                                                        outline
                                                        clearable
                                                        v-model.number="$v.conditionChangeValue.$model"
                                                        :error-messages="conditionChangeValueErrors" 
                                                    ></v-select>
                                                    <!-- Other Inputs -->
                                                    <v-text-field
                                                        :label=changeAttributeInputLabel
                                                        v-show="!empty(conditionChangeAttribute) && conditionChangeAttribute != 'fm' && conditionChangeOperator != 'cv'"
                                                        dense
                                                        :hint="changeAttributeInputHints" 
                                                        v-model.number="$v.conditionChangeValue.$model"
                                                        :error-messages="conditionChangeValueErrors"  
                                                    ></v-text-field>
                                                </v-flex> 
                                            </v-layout>
                                        </v-container>
                                        <v-flex xs12>
                                            <!-- <v-btn :loading="loading" block type="submit" class="blue darken-4 white--text" >Add Rule</v-btn> -->
                                        </v-flex>
                                    </v-layout>
                                </v-form>
                            </v-card>
                        </v-flex>
                    </v-expand-transition>

                </v-layout>
            </v-container>
        </v-card>
    </v-dialog>
</template>
<script>
import empty from 'locutus/php/var/empty'
import { required } from 'vuelidate/lib/validators'
import array_merge from 'locutus/php/array/array_merge';
import { clone } from '../../utils/helpers' 

export default {
    name: 'edit-rules', 
    props: {
        fmType: {
            type: [Number, String],
            default: 40,
        },
    },
    validations: function(){
        return {
            conditionEditAttribute: { required },
            conditionEditOperator: { required },
            conditionEditValue: { required },
            conditionChangeAttribute: { required },
            conditionChangeOperator: { required },
            conditionChangeValue: { required },
        };
    },
    filters:{
        formatEditAttribute(input){
            console.log(input);
            var label = '';
            switch (input) {
                case 'elv':
                    label = 'Elevation' 
                    break;
                case 'slp':
                    label = 'Slope' 
                    break;
                case 'asp':
                    label = 'Aspect' 
                    break;
                case 'fm':
                    label = 'Fuel Model' 
                    break;
                case 'sh':
                    label = 'Stand Height' 
                    break;
                case 'cc':
                    label = 'Canopy Cover Percent' 
                    break;
                case 'cbh':
                    label = 'Canopy Base Height' 
                    break;
                case 'cbd':
                    label = 'Canopy Bulk Density' 
                    break;
                default:
                    break;
            }
            return label;
        },
        formatEditOperator(input){
            
            var label = '';
            switch (input) {
                case 'eq':
                    label = 'equal to' 
                    break;
                case 'ge':
                    label = 'greater than equal to' 
                    break;
                case 'gt':
                    label = 'greater than' 
                    break;
                case 'le':
                    label = 'less than equal to' 
                    break;
                case 'lt':
                    label = 'less than' 
                    break; 
                default:
                    break;
            }
            return label;
        },
        formatChangeOperator(input){
            
            var label = '';
            switch (input) {
                case 'cm':
                    label = 'is equal to the rule’s value' 
                    break;
                case 'cv':
                    label = 'Cleared the value' 
                    break;
                case 'cx':
                    label = 'Clamped to a maximum of' 
                    break;
                case 'db':
                    label = 'Decreased by'
                    break;
                case 'ib':
                    label = 'Increased by' 
                    break; 
                case 'mb':
                    label = 'Multiplied by' 
                    break; 
                case 'st':
                    label = 'equal to' 
                    break; 
                default:
                    break;
            }
            return label;
        }
    },
    data() {
        return {
            dialog: false , 
            conditionEditAttribute:'',
            conditionEditOperator:'',
            conditionEditValue:'',
            conditionChangeAttribute:'',
            conditionChangeOperator:'',
            conditionChangeValue:'',
            editRules:{
                edit:[]
            }, 
            workingEditRules:{
                edit:{
                    condition:[],
                    change:[]
                }
            }, 
            rulesetBuilder:false,
            nonEditableAttributes:[
                {
                    text:'Elevation',
                    value:'elv'
                },
                {
                    text:'Slope',
                    value:'slp'
                },
                {
                    text:'Aspect',
                    value:'asp'
                }
            ],
            defaultChangeAttributes:[ 
                {
                    text:'Fuel Model',
                    value:'fm'
                },
                {
                    text:'Stand Height',
                    value:'sh'
                },
                {
                    text:'Canopy Cover',
                    value:'cc'
                },
                {
                    text:'Canopy Base Height',
                    value:'cbh'
                },
                {
                    text:'Canopy Bulk Density',
                    value:'cbd'
                },
            ],
            conditionOperatorAttributes:[
                {
                    text:'=',
                    value:'eq'
                },
                {
                    text:'>=',
                    value:'ge'
                },
                {
                    text:'>',
                    value:'gt'
                },
                {
                    text:'<=',
                    value:'le'
                },
                {
                    text:'<',
                    value:'lt'
                },
            ],
            //https://gacc.nifc.gov/oncc/docs/13_Aids%20to%20Determining%20Fuel%20Models.pdf
            FBFM13:[
                {
                    text: '1:Short grass (1 foot)',
                    value: 1,
                },   
                {
                    text: '2:Timber (grass and understory)',
                    value: 2,
                },   
                {
                    text: '3:Tall grass (2.5 feet)',
                    value: 3,
                },   
                {
                    text: '4:Chaparral (6 feet)',
                    value: 1,
                },   
                {
                    text: '5:Brush (2 feet)',
                    value: 5,
                },   
                {
                    text: '6:Dormant brush, hardwood slash',
                    value: 6,
                },   
                {
                    text: '7:Southern rough',
                    value: 7,
                },   
                {
                    text: '8:Closed timber litter',
                    value: 8,
                },   
                {
                    text: '9:Hardwood litter',
                    value: 9,
                },   
                {
                    text: '10:Timber (litter and understory)',
                    value: 10,
                },   
                {
                    text: '11:Light logging slash',
                    value: 11,
                },   
                {
                    text: '12:Medium logging slash',
                    value: 12,
                },   
                {
                    text: '13:Heavy logging slash',
                    value: 13,
                },            
            ], 
            //https://www.nwcg.gov/publications/pms437/fuels/surface-fuel-model-descriptions
            FBFM40:[
                {
                    value:91,
                    tag: 'NB1',
                    text:'91:Urban',
                    description:'Fuel model NB1 consists of land covered by urban and suburban development. To be called NB1, the area under consideration must not support wildland fire spread. In some cases, areas mapped as NB1 may experience structural fire losses during a wildland fire incident; however, structure ignition in those cases is either house-to-house or by firebrands, neither of which is directly modeled using fire behavior fuel models. If sufficient inflammable vegetation surrounds structures such that wildland fire spread is possible, then choose a fuel model appropriate for the wildland vegetation rather than NB1'
                },
                {
                    value:92,
                    tag: 'NB2',
                    text:'92:Snow/Ice',
                    description:'Land covered by permanent snow or ice is included in NB2. Areas covered by seasonal snow can be mapped to two different fuel models: NB2 for use when snow-covered and another for use in the fire season.'
                },
                {
                    value:93,
                    tag: 'NB3',
                    text:'93:Agriculture',
                    description:'Fuel model NB3 is agricultural land maintained in a non-burnable condition; examples include irrigated annual crops, mowed or tilled orchards, and so forth. However, there are many agricultural areas that are not kept in a non-burnable condition. For example, grass is often allowed to grow beneath vines or orchard trees, and wheat or similar crops are allowed to cure before harvest; in those cases, use a fuel model other than NB3.'
                },
                {
                    value:98,
                    tag: 'NB8',
                    text:'98:Water',
                    description:'Land covered by open bodies of water such as lakes, rivers and oceans.'
                },
                {
                    value:99,
                    tag: 'NB9',
                    text:'99:Barren',
                    description:' Land devoid of enough fuel to support wildland fire spread is covered by fuel model NB9. Such areas may include gravel pits, arid deserts with little vegetation, sand dunes, rock outcroppings, beaches, and so forth.'
                },
                {
                    value:101,
                    tag: 'GR1',
                    text:'101:Short, sparse dry climate grass',
                    description:'This model uses dynamic transfer of herb fuel load from live to dead. The primary carrier of fire is sparse grass, though small amounts of fine dead fuel may be present. The grass in GR1 is generally short, either naturally or by heavy grazing, and may be sparse or discontinuous. Moisture of extinction of GR1 is indicative of dry climate fuelbeds, but may also be applied in high-extinction moisture fuelbeds, because in both cases predicted spread rate and flame length are low compared to other GR models'
                },
                {
                    value:102,
                    tag: 'GR2',
                    text:'102:Low load dry climate grass',
                    description:'Uses dynamic transfer of herb fuel load from live to dead. Primary carrier of fire is grass, though small amounts of fine dead fuel may be present. Load is greater than GR1. Fuelbed may be more continuous. Shrubs do not affect fire behavior.'
                },
                {
                    value:103,
                    tag: 'GR3',
                    text:'103:Low load very coarse humid climate grass',
                    description:'This model uses dynamic transfer of herb fuel load from live to dead. The primary carrier of fire is continuous, coarse, humid-climate grass. Grass and herb fuel load is relatively light; fuelbed depth is about 2 feet. Shrubs are not present in significant quantity to affect fire behavior.'
                },
                {
                    value:104,
                    tag: 'GR4',
                    text:'104:Moderate load dry climate grass',
                    description:'This model uses dynamic transfer of herb fuel load from live to dead. The primary carrier of fire is continuous, dry-climate grass. Load and depth are greater than GR2-fuelbed depth is about 2-feet.'
                },
                {
                    value:105,
                    tag: 'GR5',
                    text:'105:Low load humid climate grass',
                    description:'This model uses dynamic transfer of herb fuel load from live to dead. The primary carrier of fire is humid-climate grass. Load is greater than GR3 but depth is lower, about 1-2-feet.'
                },
                {
                    value:106,
                    tag: 'GR6',
                    text:'106:Moderate load humid climate grass',
                    description:'This model uses dynamic transfer of herb fuel load from live to dead. The primary carrier of fire is continuous humid-climate grass. Load is greater than GR5 but depth is about the same. Grass is less coarse than GR5.'
                },
                {
                    value:107,
                    tag: 'GR7',
                    text:'107:High load dry climate grass',
                    description:'Uses dynamic transfer of herb fuel load from live to dead. Primary carrier is continuous dry-climate grass. Load and depth greater than GR4. Grass about 3-feet tall.'
                },
                {
                    value:108,
                    tag: 'GR8',
                    text:'108:High load very coarse humid climate grass',
                    description:'This model uses dynamic transfer of herb fuel load from live to dead. The primary carrier of fire is continuous, very coarse, humid-climate grass. Load and depth are greater than GR6. Spread rate and flame length can be extreme if grass is fully cured.'
                },
                {
                    value:109,
                    tag: 'GR9',
                    text:'109:Very high load humid climate grass-shrub',
                    description:'This model uses dynamic transfer of herb fuel load from live to dead. The primary carrier of fire is dense, tall, humid-climate grass. Load and depth are greater than GR8, about 6-feet tall. Spread rate and flame length can be extreme if grass is fully or mostly cured.'
                },
                {
                    value:121,
                    tag: 'GS1',
                    text:'121:Low load dry climate grass-shrub',
                    description:'This model uses dynamic transfer of herb fuel load from live to dead. The primary carrier of fire is grass and shrubs combined. Shrubs are about 1 foot high, grass load is low. Spread rate is moderate; flame length low. Moisture of extinction is low.'
                },
                {
                    value:122,
                    tag: 'GS2',
                    text:'122:Moderate load dry climate grass-shrub',
                    description:'Primary carrier is grass and shrubs combined. Shrubs are 1-3-feet high, grass load is moderate. Spread rate is high; flame length moderate. Moisture of extinction low.'
                },
                {
                    value:123,
                    tag: 'GS3',
                    text:'123:Moderate load humid climate grass-shrub',
                    description:'This model uses dynamic transfer of herb fuel load from live to dead. The primary carrier of fire is grass and shrubs combined. Moderate grass/shrub load, average grass/shrub depth less than 2-feet. Spread rate is high; flame length moderate. Moisture of extinction is high.'
                },
                {
                    value:124,
                    tag: 'GS4',
                    text:'124:High load humid climate grass-shrub',
                    description:'The primary carrier of fire is grass and shrubs combined. Heavy grass/shrub load, depth greater than 2-feet. Spread rate high; flame length very high. Moisture of extinction is high.'
                },
                {
                    value:141,
                    tag: 'SH1',
                    text:'141:Low load dry climate shrub',
                    description:'This model uses dynamic transfer of herb fuel load from live to dead. The primary carrier of fire in SH1 is woody shrubs and shrub litter. Low shrub fuel load, fuelbed depth about 1 foot; some grass may be present. Spread rate is very low; flame length very low.'
                },
                {
                    value:142,
                    tag: 'SH2',
                    text:'142:Mod. load dry climate shrub',
                    description:'The primary carrier of fire in SH2 is woody shrubs and shrub litter. Moderate fuel load (higher than SH1), depth about 1 foot, and no grass fuel present. Spread rate is low; flame length low.'
                },
                {
                    value:143,
                    tag: 'SH3',
                    text:'143:Mod. load humid climate shrub',
                    description:'The primary carrier of fire in SH3 is woody shrubs and shrub litter. Moderate shrub load, possibly with pine overstory or herbaceous fuel, fuel bed depth 2-3-feet. Spread rate is low; flame length low.'
                },
                {
                    value:144,
                    tag: 'SH4',
                    text:'144:Low load humid climate timber-shrub',
                    description:'The primary carrier of fire in SH4 is woody shrubs and shrub litter. Low to moderate shrub and litter load, possibly with pine overstory, fuel bed depth about 3-feet. Spread rate is high; flame length moderate.'
                },
                {
                    value:145,
                    tag: 'SH5',
                    text:'145:High load dry climate shrub',
                    description:'The primary carrier of fire in GS4 is grass and shrubs combined. Heavy grass/shrub load, depth greater than 2-feet. Spread rate very high; flame length very high. Moisture of extinction is high.'
                },
                {
                    value:146,
                    tag: 'SH6',
                    text:'146:Low load humid climate shrub',
                    description:'The primary carrier of fire in SH6 is woody shrubs and shrub litter. Dense shrubs, little or no herbaceous fuel, fuelbed depth about 2-feet. Spread rate is high; flame length high.'
                },
                {
                    value:147,
                    tag: 'SH7',
                    text:'147:Very high load dry climate shrub',
                    description:'The primary carrier of fire is woody shrubs and shrub litter. Very heavy shrub load, depth 4-6-feet. Spread rate lower than SH5, but flame length similar. Spread rate is high; flame length very high.'
                },
                {
                    value:148,
                    tag: 'SH8',
                    text:'148:High load humid climate shrub',
                    description:'The primary carrier of fire in SH8 is woody shrubs and shrub litter. Dense shrubs, little or no herbaceous fuel, fuelbed depth about 3-feet. Spread rate is high; flame length high.'
                },
                {
                    value:149,
                    tag: 'SH9',
                    text:'149:Very high load humid climate shrub',
                    description:'This model uses dynamic transfer of herb fuel load from live to dead. The primary carrier of fire in SH9 is woody shrubs and shrub litter. Dense, finely branched shrubs with significant fine dead fuel, about 4-6-feet tall; some herbaceous fuel may be present. Spread rate is high, flame length very high.'
                },
                {
                    value:161,
                    tag: 'TU1',
                    text:'161:Light load dry climate timber-grass-shrub',
                    description:'This model uses dynamic transfer of herb fuel load from live to dead. The primary carrier of fire in is low load of grass and/or shrub with litter. Spread rate is low; flame length low.'
                },
                {
                    value:162,
                    tag: 'TU2',
                    text:'162:Moderate load humid climate timber-shrub',
                    description:'The primary carrier of fire in TU2 is moderate litter load with shrub component. High extinction moisture. Spread rate is moderate; flame length low.'
                },
                {
                    value:163,
                    tag: 'TU3',
                    text:'163:Moderate load humid climate timber-grass-shrub',
                    description:'This model uses dynamic transfer of herb fuel load from live to dead. The primary carrier of fire in TU3 is moderate forest litter with grass and shrub components. Extinction moisture is high. Spread rate is high; flame length moderate.'
                },
                {
                    value:164,
                    tag: 'TU4',
                    text:'164:Dwarf conifer with understory',
                    description:'The primary carrier of fire is grass, lichen or moss understory plants. If live woody moisture content is set to 100 percent, this fuel model mimics the behavior of Norum’s (1982) empirical calibration for Alaska Black Spruce. Spread rate is moderate; flame length moderate.'
                },
                {
                    value:165,
                    tag: 'TU5',
                    text:'165:Very high load dry climate timber-shrub',
                    description:'The primary carrier of fire in TU5 is heavy forest litter with a shrub or small tree understory. Spread rate is moderate; flame length moderate.'
                },
                {
                    value:181,
                    tag: 'TL1',
                    text:'181:Low load compact conifer litter',
                    description:'The primary carrier of fire is compact forest litter. Light to moderate load, fuels 1-2 inches deep. May be used to represent a recently burned forest. Spread rate is very low; flame length very low.'
                },
                {
                    value:182,
                    tag: 'TL2',
                    text:'182:Low load broadleaf litter',
                    description:'The primary carrier of fire is broadleaf (hardwood) litter. Low load, compact litter. Spread rate is very low; flame length very low.'
                },
                {
                    value:183,
                    tag: 'TL3',
                    text:'183:Moderate load conifer litter',
                    description:'The primary carrier of fire is moderate load conifer litter, light load of coarse fuels. Spread rate is very low; flame length low.'
                },
                {
                    value:184,
                    tag: 'TL4',
                    text:'184:Small downed logs',
                    description:'The primary carrier of fire is moderate load of fine litter and coarse fuels. Includes small diameter downed logs. Spread rate is low; flame length low.'
                },
                {
                    value:185,
                    tag: 'TL5',
                    text:'185:High load conifer litter',
                    description:'The primary carrier of fire is High load conifer litter; light slash or mortality fuel. Spread rate is low; flame length low.'
                },
                {
                    value:186,
                    tag: 'TL6',
                    text:'186:Moderate load broadleaf litter',
                    description:'The primary carrier of fire is moderate load broadleaf litter, less compact than TL2. Spread rate is moderate; flame length low.'
                },
                {
                    value:187,
                    tag: 'TL7',
                    text:'187:Large downed logs',
                    description:'The primary carrier of fire is heavy load forest litter, includes larger diameter downed logs. Spread rate low; flame length low.'
                },
                {
                    value:188,
                    tag: 'TL8',
                    text:'188:Long-needle litter',
                    description:'The primary carrier of fire in is moderate load long-needle pine litter, may include small amount of herbaceous load. Spread rate is moderate; flame length low.'
                },
                {
                    value:189,
                    tag: 'TL9',
                    text:'189:Very high load broadleaf litter',
                    description:'The primary carrier of fire is very high load, fluffy broadleaf litter. Can also be used to represent heavy needle-drape. Spread rate is moderate; flame length moderate.'
                },
                {
                    value:201,
                    tag: 'SB1',
                    text:'201:Low load activity fuel',
                    description:'Primary carrier of fire is light dead and down activity fuel. Fine fuel load is 10 to 20 t/ac, weighted toward fuels 1-3 in diameter class, depth is less than 1 foot. Spread rate is moderate; flame length low.'
                },
                {
                    value:202,
                    tag: 'SB2',
                    text:'202:Moderate load activity or low load blowdown',
                    description:'The primary carrier of fire is moderate dead and down activity fuel or light blowdown. Fine fuel load is 7 to 12 t/ac, evenly distributed across 0-0.25, 0.25-1, and 1-3 inch diameter classes, depth is about 1 foot. Blowdown is scattered, with many trees still standing. Spread rate is moderate; flame length moderate.'
                },
                {
                    value:203,
                    tag: 'SB3',
                    text:'203:High load activity fuel or moderate load blowdown',
                    description:'The primary carrier of fire is heavy dead and down activity fuel or moderate blowdown. Fine fuel load is 7 to 12 t/ac, weighted toward 0-0.25 inch diameter class, depth is more than 1 foot. Blowdown is moderate; trees compacted to near the ground. Spread rate is high; flame length high.'
                },
                {
                    value:204,
                    tag: 'SB4',
                    text:'204:High load blowdown',
                    description:'The primary carrier of fire is heavy blowdown fuel. Blowdown is total, fuelbed not compacted, most foliage and fine fuel still attached to blowdown. Spread rate very high; flame length very high.'
                }
            ],
            defaultOperatorAttributes:[
                {
                    text:' Equal to the rule’s value', 
                    value:'cm'
                },
                {
                    text:'Clear the value',
                    value:'cv'
                },
                {
                    text:'Clamp to a maximum',
                    value:'cx'
                },
                {
                    text:'Decrease by',
                    value:'db'
                },
                {
                    text:'Increase by',
                    value:'ib'
                },
                {
                    text:'Multiply by',
                    value:'mb'
                },
                {
                    text:'Set the attribute to',
                    value:'st'
                }
            ], 
            FMOperatorAttributes:[ 
                {
                    text:'Clear the value',
                    value:'cv'
                }, 
                {
                    text:'Set the attribute to',
                    value:'st'
                }
            ],
        };
    },
    methods:{
        empty, 
        saveRuleset(){
            var vm = this;
            console.log('saving ruleset');
            
            // if(!this.editRules.hasOwnProperty('edit')){ 
            //     vm.$set(this.editRules, 'edit', [])
            // }
            var payload = clone(this.workingEditRules.edit);
            this.editRules.edit.push(payload);
            this.cancelRuleset();
            // this.clearWorkingEditRules();
            // this.clearConditionChangeBuilder();
            // this.clearConditionBuilder();
            // this.rulesetBuilder = false; 
        },
        close(){
            this.dialog = false;
        },
        save(){
            this.$emit('saved',this.editRules);
            this.dialog = false;
        },
        newRuleset(){
            this.rulesetBuilder = true;
        },
        clearWorkingEditRules(){
            this.workingEditRules.edit.condition = [];
            this.workingEditRules.edit.change = [];
        },
        cancelRuleset(){
            this.clearWorkingEditRules();
            this.clearConditionChangeBuilder();
            this.clearConditionBuilder();
            this.rulesetBuilder = false; 
        },
        conditionBuilderSubmit($v){
            var vm = this;
            this.$v.conditionEditAttribute.$touch();
            this.$v.conditionEditOperator.$touch();
            this.$v.conditionEditValue.$touch();
            if (!this.$v.conditionEditAttribute.$invalid && !this.$v.conditionEditOperator.$invalid && !this.$v.conditionEditValue.$invalid) {
                console.log('form passed validations')

                var condition = {
                    attribute:this.conditionEditAttribute,
                    operator:this.conditionEditOperator,
                    value: this.conditionEditValue
                }
                this.workingEditRules.edit.condition.push(condition);
                this.clearConditionBuilder();
                console.log(condition);
            }else{ 
                console.log('validation failed')
            }
        },
        conditionChangeBuilderSubmit($v){
            var vm = this;  
            var isValid;
            if(this.conditionChangeOperator == 'cv'){
                this.$v.conditionChangeAttribute.$touch();
                this.$v.conditionChangeOperator.$touch();
                isValid = (!this.$v.conditionChangeAttribute.$invalid && !this.$v.conditionChangeOperator.$invalid ) ;
            }else{ 
                this.$v.conditionChangeAttribute.$touch();
                this.$v.conditionChangeOperator.$touch();
                this.$v.conditionChangeValue.$touch();
                isValid = (!this.$v.conditionChangeAttribute.$invalid && !this.$v.conditionChangeOperator.$invalid && !this.$v.conditionChangeValue.$invalid) ;
            }

            if (isValid) {
                console.log('form passed validations') 
                var condition = {
                    attribute:this.conditionChangeAttribute,
                    operator:this.conditionChangeOperator,
                    value: this.conditionChangeValue
                }
                this.workingEditRules.edit.change.push(condition);
                this.clearConditionChangeBuilder();
                console.log(condition);
            }else{ 
                console.log('validation failed')
            }
        },
        clearConditionBuilder(){
            this.conditionEditAttribute='';
            this.conditionEditOperator='';
            this.conditionEditValue='';
            this.$v.conditionEditAttribute.$reset();
            this.$v.conditionEditOperator.$reset();
            this.$v.conditionEditValue.$reset(); 
        },
        clearConditionChangeBuilder(){
            this.conditionChangeAttribute='';
            this.conditionChangeOperator='';
            this.conditionChangeValue='';
            this.$v.conditionChangeAttribute.$reset();
            this.$v.conditionChangeOperator.$reset();
            this.$v.conditionChangeValue.$reset();
        },

        getBaseAttributeInputLabel(input){
            var label = '';
            switch (input) {
                case 'elv':
                    label = 'Enter your reference Elevation' 
                    break;
                case 'slp':
                    label = 'Enter your reference Slope' 
                    break;
                case 'asp':
                    label = 'Enter your reference Aspect' 
                    break;
                case 'fm':
                    label = 'Select A Fuel Model To Edit' 
                    break;
                case 'sh':
                    label = 'Enter your reference Stand Height' 
                    break;
                case 'cc':
                    label = 'Enter your reference Canopy Cover Percent' 
                    break;
                case 'cbh':
                    label = 'Enter your reference Canopy Base Height' 
                    break;
                case 'cbd':
                    label = 'Enter your reference Canopy Bulk Density' 
                    break;
                default:
                    break;
            }
            return label;
        },  
        
        removeCondition(index){ 
			this.workingEditRules.edit.condition.splice(index,1); 
        },
        removeChange(index){
			this.workingEditRules.edit.change.splice(index,1);  
        }, 
        removeRule(index){
			this.editRules.edit.splice(index,1);  
        }, 
    },
    computed:{  
        userChangeAttributes(){
            var list =  clone(this.defaultChangeAttributes); 
            var selectedValues = [];
            var length = list.length;
            var selectedLength = this.workingEditRules.edit.change.length;

            for (let index = 0; index < selectedLength; index++) {
                const element = this.workingEditRules.edit.change[index];
                selectedValues.push(element.attribute); 
            }
            for (let index = 0; index < length; index++) {
                const value = list[index].value;
                list[index].disabled = (selectedValues.indexOf(value) > -1);
            }
            return list;
        },
        changeOperatorAttributes(){ 
            return (this.conditionChangeAttribute == 'fm') ? this.FMOperatorAttributes : this.defaultOperatorAttributes;  
        },
        userEditAttributes(){
            return array_merge(this.nonEditableAttributes,this.defaultChangeAttributes);
        },
        changeAttributeInputLabel(){
            return this.getBaseAttributeInputLabel(this.conditionChangeAttribute);
        },
        changeAttributeInputHints(){ 
            console.log(this.conditionChangeOperator)
            var label = '';
            switch (this.conditionChangeOperator) {
                case 'cm':
                    label = 'is equal to the rule’s value' 
                    break;
                // case 'cv':
                //     label = 'Clear the value – set the attribute value to NO DATA (-9999)' 
                //     break;
                case 'cx':
                    label = 'Clamp to a maximum – if the attribute value is greater than the associated value, set it to that value' 
                    break;
                case 'db':
                    label = 'Decrease by – subtract the associated value from the attribute value; if the new value is out of range, set it to the minimum value for the attribute' 
                    break;
                case 'ib':
                    label = 'Increase by – add the associated value to the attribute value; if the new value is out of range, set it to the maximum value for the attribute' 
                    break;
                case 'mb':
                    label = 'Multiply by – multiply the attribute value by the associated value; if the new value is out of range, set it to the maximum value for the attribute' 
                    break;
                case 'st':
                    label = 'Enter value you want to set this attribute to' 
                    break;
                default:
                    break;
            }
            return label;
        },
        conditionAttributeInputLabel(){
            return this.getBaseAttributeInputLabel(this.conditionEditAttribute);
        },
        conditionAttributeInputHints(){
            var label = '';
            switch (this.conditionEditAttribute) {
                case 'elv':
                    label = 'Elevation of landscape cell in meters' 
                    break;
                case 'slp':
                    label = 'Slope of landscape cell in degrees (0 to 90)' 
                    break;
                case 'asp':
                    label = 'Aspect of landscape cell in degrees (0 to 360; -1 for no aspect, i.e. flat; 0 is north)' 
                    break;
                case 'sh':
                    label = 'Acceptable values range from 0 to 150 meters' 
                    break;
                case 'cc':
                    label = 'Acceptable values range from 0 to 100 percent' 
                    break;
                case 'cbh':
                    label = 'Acceptable values range from 0 to 150 meters' 
                    break;
                case 'cbd':
                    label = 'Acceptable values range from 0 to 0.50 kg/m^3' 
                    break;
                default:
                    break;
            }
            return label;
            // return this.getBaseAttributeInputHints(this.conditionEditAttribute);
        }, 
        conditionEditAttributeErrors () {
            const errors = []
            if (!this.$v.conditionEditAttribute.$dirty) {
                return errors;
            } 
            if (!this.$v.conditionEditAttribute.required) {  
                errors.push('Condition Attribute Required');
            } 
            return errors;
        }, 
        conditionEditOperatorErrors(){ 
            const errors = []
            if (!this.$v.conditionEditOperator.$dirty) {
                return errors;
            } 
            if (!this.$v.conditionEditOperator.required) {  
                errors.push('Condition Attribute Operator Required');
            } 
            return errors;
        },
        conditionEditValueErrors(){  
            const errors = []
            if (!this.$v.conditionEditValue.$dirty) {
                return errors;
            } 
            if (!this.$v.conditionEditValue.required) {  
                errors.push('Condition Attribute Value Required');
            } 
            return errors;
        },
        conditionChangeAttributeErrors () {
            const errors = []
            if (!this.$v.conditionChangeAttribute.$dirty) {
                return errors;
            } 
            if (!this.$v.conditionChangeAttribute.required) {  
                errors.push('Change Attribute Required');
            } 
            return errors;
        }, 
        conditionChangeOperatorErrors(){ 
            const errors = []
            if (!this.$v.conditionChangeOperator.$dirty) {
                return errors;
            } 
            if (!this.$v.conditionChangeOperator.required) {  
                errors.push('Change Attribute Operator Required');
            } 
            return errors;
        },
        conditionChangeValueErrors(){  
            const errors = []
            if (!this.$v.conditionChangeValue.$dirty) {
                return errors;
            } 
            if (!this.$v.conditionChangeValue.required) {  
                errors.push('Change Attribute Value Required');
            } 
            return errors;
        },
    }
}
</script>