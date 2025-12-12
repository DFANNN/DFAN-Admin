export const permissionDirective = {
  mounted(el: HTMLElement, binding: DirectiveBinding<string | string[]>) {
    console.log(`output->`, el)
    console.log(`output->`, binding)
  },
}
