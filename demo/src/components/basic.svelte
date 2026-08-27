<script lang="ts">
  // import { Card } from "@sv0/components/card";

  let { class: className, href, intent, size, children, ...rest }: any = $props();
</script>

<div class="flex flex-col items-center justify-center gap-4">
  <!-- <Card.Root class="bg-black font-mono text-sm">
    <Card.Content class="p-4">
      <div>Hello</div>
<div class="text-slate-500">{JSON.stringify(button({ intent }), null, 2)}</div>
    </Card.Content>
  </Card.Root> 
-->
  <!-- <div class={button({ intent, size })} {...rest}>
    {@render children?.()}
  </div> -->
  basic
  {@render children?.()}
</div>
