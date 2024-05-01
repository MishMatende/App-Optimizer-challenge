export type VisitTypesTypes =
	| "inp-regular"
	| "inp-emergency"
	| "inp-ICU"
	| "inp-HDU"
	| "inp-procedure-la"
	| "inp-procedure-ga"
	| "outp-consultation"
	| "outp-review"
	| "outp-procedure";
export type VisitTypesTypesList = VisitTypesTypes[];
export const VisitTypes: VisitTypesTypes[] = [
	"inp-regular",
	"inp-emergency",
	"inp-ICU",
	"inp-HDU",
	"inp-procedure-la",
	"inp-procedure-ga",
	"outp-consultation",
	"outp-review",
	"outp-procedure",
];
export const vtl = VisitTypes as unknown as [string, ...string[]];

export function isInpatientVisit(val: string): boolean {
	return vtl.includes(val) && val.startsWith("i");
}
export function isOutpatientVisit(val: string): boolean {
	return vtl.includes(val) && val.startsWith("o");
}

export function isValidVisitType(val: string): boolean {
	return vtl.includes(val);
}

export function InpVisitType(val: string) {
	if (!val || !isInpatientVisit(val)) return;
	if (val.endsWith("a")) return "procedure";
	return val.split("-")[1];
}

export function OutpVisitType(val: string) {
	if (!val || !isOutpatientVisit(val)) return;
	return val.split("-")[1];
}

export type ServiceTypes = "IC" | "IL" | "OC" | "OP" | "IG";
export const ServiceTypesList: ServiceTypes[] = ["OC", "OP", "IC", "IL", "IG"];

export const stl_ = ServiceTypesList as unknown as [string, ...string[]];

export const convertVisitTypeToServiceType = (visitType: VisitTypesTypes) => {
	switch (visitType) {
		case "inp-regular":
			return "IC" as const;
		case "inp-emergency":
			return "IC" as const;
		case "inp-ICU":
			return "IC" as const;
		case "inp-HDU":
			return "IC" as const;
		case "inp-procedure-la":
			return "IL" as const;
		case "inp-procedure-ga":
			return "IG" as const;
		case "outp-consultation":
			return "OC" as const;
		case "outp-review":
			return "OC" as const;
		case "outp-procedure":
			return "OP" as const;
	}
	throw new Error(`invalid visitType: ${visitType}`);
};

export const convertServiceTypeToVisitType = (serviceType: ServiceTypes) => {
	switch (serviceType) {
		case "IC":
			return "inp-regular inp-emergency" as const;
		case "IL":
			return "inp-procedure-la" as const;
		case "OC":
			return "outp-consultation outp-review" as const;
		case "OP":
			return "outp-procedure" as const;
		case "IG":
			return "inp-procedure-ga" as const;
	}
	throw new Error(`invalid serviceType: ${serviceType}`);
};
