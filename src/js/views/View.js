import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  /**
   * Renders markup in the DOM or returns it
   * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
   * @param {boolean} [render=true] If false, returns markup string
   * @returns {undefined | string} Markup string if render=false
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;

    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    this._data = data;

    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentEl.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      // Update changed TEXT
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      )
        curEl.textContent = newEl.textContent;

      // Update changed ATTRIBUTES
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  renderSpinner() {
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', this._generateSpinnerMarkup());
  }

  renderError(message = this._errorMessage) {
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', this._generateErrorMarkup(message));
  }

  renderMessage(message = this._message) {
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', this._generateMessageMarkup(message));
  }

  _generateSpinnerMarkup() {
    return `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>
    `;
  }

  _generateErrorMarkup(message) {
    return `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;
  }

  _generateMessageMarkup(message) {
    return `
      <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;
  }

  _clear() {
    this._parentEl.innerHTML = '';
  }
}
