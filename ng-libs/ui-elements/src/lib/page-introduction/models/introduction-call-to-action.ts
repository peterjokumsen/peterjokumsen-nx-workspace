export interface IntroductionCallToAction {
  id?: string;
  label: string;
  type?:
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'error'
    | 'main'
    | 'accent'
    | 'danger';
}
