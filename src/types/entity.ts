import { TypeToken } from "../utils/type.constants";
import {
    IDefinition,
    CDSType,
    IElement,
    CDSCardinality,
    CDSKind,
} from "../utils/cds";
import { BaseType } from "./base.type";
import { Enum } from "./enum";

/**
 * Type that represents a CDS entity.
 *
 * Will be converted into a Typescript interface.
 *
 * @export
 * @class Entity
 * @extends {BaseType}
 */
export class Entity extends BaseType {
    /**
     * Default constructor.
     * @param {string} name Name of the entity
     * @param {IDefinition} definition CDS entity definition
     * @param {string} [prefix=""] Interface prefix
     * @memberof Entity
     */
    constructor(name: string, definition: IDefinition, prefix: string = "") {
        super(name, definition, prefix);
    }

    /**
     * Converts the entity to a Typescript type.
     *
     * @returns {string}
     * @memberof Entity
     */
    public toType(): string {
        let result = "";

        let code: string[] = [];
        let enumCode: string[] = [];
        code.push(this.createInterface());
        if (this.definition.elements) {
            for (const [key, value] of this.definition.elements) {
                if (value.enum) {
                    const enumName =
                        this.sanitizeName(this.sanitizeTarget(this.name)) +
                        this.sanitizeName(key);
                    const definition: IDefinition = {
                        kind: CDSKind.type,
                        type: value.type,
                        enum: value.enum,
                    };

                    const enumType = new Enum(enumName, definition);
                    enumCode.push(enumType.toType());

                    code.push(
                        this.createInterfaceField(key, value, this.prefix)
                    );
                } else {
                    code.push(
                        this.createInterfaceField(key, value, this.prefix)
                    );
                }
            }
        }
        code.push(`${TypeToken.curlyBraceRight}`);

        result =
            enumCode.length > 0
                ? enumCode.join("\n") + "\n\n" + code.join("\n")
                : code.join("\n");
        return result;
    }

    /**
     * Returns the sanitized name of the entity.
     *
     * @returns {string} Sanitized name of the entity
     * @memberof Entity
     */
    public getSanitizedName(): string {
        return this.sanitizeName(this.sanitizeTarget(this.name));
    }

    /**
     * Returns the model name of the entity.
     *
     * @returns {string} Model name of the entity
     * @memberof Entity
     */
    public getModelName(): string {
        return this.name;
    }
}
