import * as React from "react";
import { css } from "@uifabric/utilities";
import { Persona, PersonaSize } from "office-ui-fabric-react/lib/Persona";
import { parseWorkItemIdentityName, parseUniquefiedIdentityName } from "../../utils/identity";
import { IdentityRef } from "VSS/WebApi/Contracts";

export interface IPersonaLegendProps {
    label: string;

    identityRef: IdentityRef;
}

export class PersonaLegend extends React.Component<IPersonaLegendProps> {
    render(): JSX.Element {
        const { identityRef } = this.props;

        return (
            <Persona
                className={css("identity-view")}
                size={PersonaSize.extraExtraSmall}
                imageUrl={identityRef.imageUrl}
                primaryText={identityRef.displayName}
                secondaryText={identityRef.uniqueName}
            />
        );
    }
}