export default interface RuleFormValues {
  name: string;
  description: string;
  scope: 'Posts & comments' | 'Posts only' | 'Comments only';
}
