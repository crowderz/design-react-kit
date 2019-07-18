/* eslint react/prefer-stateless-function: 0 */

import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Util } from "reactstrap";

const { mapToCssModules, deprecated, warnOnce } = Util;

const propTypes = {
    children: PropTypes.node,
    type: PropTypes.string,
    size: PropTypes.string,
    bsSize: PropTypes.string,
    state: deprecated(
        PropTypes.string,
        'Please use the props "valid" and "invalid" to indicate the state.'
    ),
    valid: PropTypes.bool,
    invalid: PropTypes.bool,
    tag: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    innerRef: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.func,
        PropTypes.string
    ]),
    static: deprecated(PropTypes.bool, 'Please use the prop "plaintext"'),
    plaintext: PropTypes.bool,
    addon: PropTypes.bool,
    className: PropTypes.string,
    cssModule: PropTypes.object,
    label: PropTypes.string,
    infoText: PropTypes.string,
};

const defaultProps = {
    type: "text"
};

class Input extends React.Component {
    render() {
        const {
            className,
            cssModule,
            type,
            state,
            tag,
            addon,
            static: staticInput,
            plaintext,
            innerRef,
            label,
            infoText,
            ...attributes
        } = this.props;
        let { bsSize, valid, invalid } = this.props;

        const checkInput = ["radio", "checkbox"].indexOf(type) > -1;
        const isNotaNumber = new RegExp("\\D", "g");

        const fileInput = type === "file";
        const textareaInput = type === "textarea";
        const selectInput = type === "select";
        let Tag = tag || (selectInput || textareaInput ? type : "input");

        let formControlClass = "form-control";

        if (plaintext || staticInput) {
            formControlClass = `${formControlClass}-plaintext`;
            Tag = tag || "p";
        } else if (fileInput) {
            formControlClass = `${formControlClass}-file`;
        } else if (checkInput) {
            if (addon) {
                formControlClass = null;
            }
            /* Causes a regression with `bootstrap-italia`
            else {
                formControlClass = 'form-check-input';
            }
            */
        }

        if (
            state &&
            typeof valid === "undefined" &&
            typeof invalid === "undefined"
        ) {
            if (state === "danger") {
                invalid = true;
            } else if (state === "success") {
                valid = true;
            }
        }

        if (attributes.size && isNotaNumber.test(attributes.size)) {
            warnOnce(
                'Please use the prop "bsSize" instead of the "size" to bootstrap\'s input sizing.'
            );
            bsSize = attributes.size;
            delete attributes.size;
        }

        const classes = mapToCssModules(
            classNames(
                className,
                invalid && "is-invalid",
                valid && "is-valid",
                bsSize ? `form-control-${bsSize}` : false,
                formControlClass
            ),
            cssModule
        );
        const wrapperClass = mapToCssModules(
            classNames(className, "form-group"),
            cssModule
        );

        if (Tag === "input" || typeof tag !== "string") {
            attributes.type = type;
        }

        if (
            attributes.children &&
            !(
                plaintext ||
                staticInput ||
                type === "select" ||
                typeof Tag !== "string" ||
                Tag === "select"
            )
        ) {
            warnOnce(
                `Input with a type of "${type}" cannot have children. Please use "value"/"defaultValue" instead.`
            );
            delete attributes.children;
        }

        if (label || infoText) {
          return (
              <div className={wrapperClass}>
                  <Tag
                      {...attributes}
                      ref={innerRef}
                      className={classes}
                      id="inputLabel"
                  />
                  <label htmlFor="inputLabel" className="active">
                      {this.props.label}
                  </label>
                  <small class="form-text text-muted">
                    {this.props.infoText}
                </small>
              </div>
          );
      }

        return <Tag {...attributes} ref={innerRef} className={classes} />;
    }
}

Input.propTypes = propTypes;
Input.defaultProps = defaultProps;

export default Input;
