class ClassTemplateTag {
  constructor() {
    this.tags = ['template']
  }

  parse(parser, nodes, lexer) {
    let tok = parser.nextToken();
    let args = parser.parseSignature(null, true);
    parser.advanceAfterBlockEnd(tok.value);

    return new nodes.CallExtension(this, 'run', args);

  }

  run(context, url) {
    console.log('run', url)
  }
}
export let TemlateTag = new ClassTemplateTag();