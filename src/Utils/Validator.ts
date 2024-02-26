
class ValidateForm {

  private StaticRules: Array<String> = [
      'required',
      'email',
      'image',
  ];
  private rules;
  private model;
  public messages = {};
  private is_valid = true;
  constructor(model: Array<object>|Object,rules: Array<object>)
  {
      this.rules = rules;
      this.model = model;
  }

  public validate =  function(){
      if (this.model instanceof Object) {
          for (const field in this.model.Validation) {
              if (Object.prototype.hasOwnProperty.call(this.model.Validation, field)) {
                     if(this.rules[field][0] == 'required' && (this.model[field] == null || this.model[field] == ''))
                     {
                         this.messages[field] = this.rules[field][1];
                         this.model.Validation[field] = true;
                     }
                     else{
                         this.model.Validation[field] = false;
                     }
              }
          }
      }
  }
  public get get_messages() : object {
      return this.messages;
  }
  public get is_form_valid() : any {
      return  Object.values(this.model.Validation).every(f => f == false);
  }


}

export default ValidateForm;
