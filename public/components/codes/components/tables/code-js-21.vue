<template>
  <div>
    {{ code }}
  </div>
</template>

<script>
  export default {
    data() {
      return {
        code: '<script>\n' +
          '  const desserts = [\n' +
          '    {\n' +
          '      name: \'Frozen Yogurt\',\n' +
          '      calories: 159,\n' +
          '      fat: 6.0,\n' +
          '      carbs: 24,\n' +
          '      protein: 4.0,\n' +
          '      iron: \'1%\',\n' +
          '    },\n' +
          '    {\n' +
          '      name: \'Ice cream sandwich\',\n' +
          '      calories: 237,\n' +
          '      fat: 9.0,\n' +
          '      carbs: 37,\n' +
          '      protein: 4.3,\n' +
          '      iron: \'1%\',\n' +
          '    },\n' +
          '    {\n' +
          '      name: \'Eclair\',\n' +
          '      calories: 262,\n' +
          '      fat: 16.0,\n' +
          '      carbs: 23,\n' +
          '      protein: 6.0,\n' +
          '      iron: \'7%\',\n' +
          '    },\n' +
          '    {\n' +
          '      name: \'Cupcake\',\n' +
          '      calories: 305,\n' +
          '      fat: 3.7,\n' +
          '      carbs: 67,\n' +
          '      protein: 4.3,\n' +
          '      iron: \'8%\',\n' +
          '    },\n' +
          '    {\n' +
          '      name: \'Gingerbread\',\n' +
          '      calories: 356,\n' +
          '      fat: 16.0,\n' +
          '      carbs: 49,\n' +
          '      protein: 3.9,\n' +
          '      iron: \'16%\',\n' +
          '    },\n' +
          '    {\n' +
          '      name: \'Jelly bean\',\n' +
          '      calories: 375,\n' +
          '      fat: 0.0,\n' +
          '      carbs: 94,\n' +
          '      protein: 0.0,\n' +
          '      iron: \'0%\',\n' +
          '    },\n' +
          '    {\n' +
          '      name: \'Lollipop\',\n' +
          '      calories: 392,\n' +
          '      fat: 0.2,\n' +
          '      carbs: 98,\n' +
          '      protein: 0,\n' +
          '      iron: \'2%\',\n' +
          '    },\n' +
          '    {\n' +
          '      name: \'Honeycomb\',\n' +
          '      calories: 408,\n' +
          '      fat: 3.2,\n' +
          '      carbs: 87,\n' +
          '      protein: 6.5,\n' +
          '      iron: \'45%\',\n' +
          '    },\n' +
          '    {\n' +
          '      name: \'Donut\',\n' +
          '      calories: 452,\n' +
          '      fat: 25.0,\n' +
          '      carbs: 51,\n' +
          '      protein: 4.9,\n' +
          '      iron: \'22%\',\n' +
          '    },\n' +
          '    {\n' +
          '      name: \'KitKat\',\n' +
          '      calories: 518,\n' +
          '      fat: 26.0,\n' +
          '      carbs: 65,\n' +
          '      protein: 7,\n' +
          '      iron: \'6%\',\n' +
          '    },\n' +
          '  ]\n' +
          '\n' +
          '  export default {\n' +
          '    data () {\n' +
          '      return {\n' +
          '        enabled: null,\n' +
          '        items: desserts,\n' +
          '        search: null,\n' +
          '        slots: [\n' +
          '          \'body\',\n' +
          '          \'body.append\',\n' +
          '          \'body.prepend\',\n' +
          '          \'footer\',\n' +
          '          \'header.data-table-select\',\n' +
          '          \'header\',\n' +
          '          \'progress\',\n' +
          '          \'item.data-table-select\',\n' +
          '          \'item.<name>\',\n' +
          '          \'no-data\',\n' +
          '          \'no-results\',\n' +
          '          \'top\',\n' +
          '        ],\n' +
          '        headers: [\n' +
          '          {\n' +
          '            text: \'Dessert (100g serving)\',\n' +
          '            align: \'start\',\n' +
          '            sortable: false,\n' +
          '            value: \'name\',\n' +
          '          },\n' +
          '          { text: \'Calories\', value: \'calories\' },\n' +
          '          { text: \'Fat (g)\', value: \'fat\' },\n' +
          '          { text: \'Carbs (g)\', value: \'carbs\' },\n' +
          '          { text: \'Protein (g)\', value: \'protein\' },\n' +
          '          { text: \'Iron (%)\', value: \'iron\' },\n' +
          '        ],\n' +
          '      }\n' +
          '    },\n' +
          '\n' +
          '    computed: {\n' +
          '      showSelect () {\n' +
          '        return this.isEnabled(\'header.data-table-select\') || this.isEnabled(\'item.data-table-select\')\n' +
          '      },\n' +
          '      hideHeaders () {\n' +
          '        return !this.showSelect\n' +
          '      },\n' +
          '      isLoading () {\n' +
          '        return this.isEnabled(\'progress\')\n' +
          '      },\n' +
          '    },\n' +
          '\n' +
          '    watch: {\n' +
          '      enabled (slot) {\n' +
          '        if (slot === \'no-data\') {\n' +
          '          this.items = []\n' +
          '        } else if (slot === \'no-results\') {\n' +
          '          this.search = \'...\'\n' +
          '        } else {\n' +
          '          this.search = null\n' +
          '          this.items = desserts\n' +
          '        }\n' +
          '      },\n' +
          '    },\n' +
          '\n' +
          '    methods: {\n' +
          '      isEnabled (slot) {\n' +
          '        return this.enabled === slot\n' +
          '      },\n' +
          '    },\n' +
          '  }\n' +
          '<\/script>'
      }
    }
  }
</script>
