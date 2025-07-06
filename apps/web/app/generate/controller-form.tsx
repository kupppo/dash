"use client";

import { Section, Option } from "./form-elements";
import Select from "../components/select";
import {
  ControllerInputs,
  ControllerInput,
} from "core/params";
import { useForm } from "react-hook-form";
import { useEffect, useRef } from "react";
import { set } from "idb-keyval";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../components/button";

const controllerOptions = ControllerInputs.map((input) => ({
  label: input,
  value: input,
}));

const defaultValues = {
  "shot": "X" as ControllerInput,
  "jump": "A" as ControllerInput,
  "dash": "B" as ControllerInput,
  "itemSelect": "Select" as ControllerInput,
  "itemCancel": "Y" as ControllerInput,
  "angleUp": "R" as ControllerInput,
  "angleDown": "L" as ControllerInput,
};

// Create a mutable array from the readonly ControllerInputs for zod enum
const controllerInputsArray = [...ControllerInputs] as const;

// Zod schema for controller mapping validation
const controllerMappingSchema = z
  .object({
    "shot": z.enum(controllerInputsArray, {
      required_error: "Shot mapping is required",
    }),
    "jump": z.enum(controllerInputsArray, {
      required_error: "Jump mapping is required",
    }),
    "dash": z.enum(controllerInputsArray, {
      required_error: "Dash mapping is required",
    }),
    "itemSelect": z.enum(controllerInputsArray, {
      required_error: "Item Select mapping is required",
    }),
    "itemCancel": z.enum(controllerInputsArray, {
      required_error: "Item Cancel mapping is required",
    }),
    "angleUp": z.enum(controllerInputsArray, {
      required_error: "Angle Up mapping is required",
    }),
    "angleDown": z.enum(controllerInputsArray, {
      required_error: "Angle Down mapping is required",
    }),
  })
  .refine(
    (data) => {
      // Check for unique values across all controller mappings
      const values = Object.values(data);
      const uniqueValues = new Set(values);
      return uniqueValues.size === values.length;
    },
    {
      message: "Each controller input must be mapped to a unique button",
      path: ["root"], // This will apply to the form root
    }
  );

type FormData = z.infer<typeof controllerMappingSchema>;

export default function ControllerForm() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(controllerMappingSchema),
    defaultValues,
  });

  const watchedValues = watch();
  const previousValues = useRef<FormData>(watchedValues);

  // Handle value swapping when a duplicate is selected
  useEffect(() => {
    const currentValues = watchedValues;
    const prevValues = previousValues.current;

    // Find which field changed
    const changedField = Object.keys(currentValues).find(
      (key) =>
        currentValues[key as keyof FormData] !==
        prevValues[key as keyof FormData]
    ) as keyof FormData | undefined;

    if (changedField) {
      const newValue = currentValues[changedField];
      const oldValue = prevValues[changedField];

      // Find if the new value is already assigned to another field
      const conflictingField = Object.keys(currentValues).find(
        (key) =>
          key !== changedField &&
          currentValues[key as keyof FormData] === newValue
      ) as keyof FormData | undefined;

      if (conflictingField) {
        // Swap the values: assign the old value to the conflicting field
        setValue(conflictingField, oldValue, { shouldValidate: true });
      }
    }

    // Update the previous values reference
    previousValues.current = currentValues;
  }, [watchedValues, setValue]);

  useEffect(() => {
    const saveLocally = async () => {
      try {
        // Only save if form is valid
        const isValid = await controllerMappingSchema.safeParseAsync(
          watchedValues
        );
        if (isValid.success) {
          await set("controller-mapping", watchedValues);
        }
      } catch (error) {
        console.error("Failed to save controller mapping to IndexedDB:", error);
      }
    };

    saveLocally();
  }, [watchedValues]);

  return (
    <form onSubmit={() => {}}>
      <Section title="Controller Options">
        {/* Display global validation error for uniqueness */}
        {errors.root && (
          <div style={{ color: "red", marginBottom: "1rem" }}>
            {errors.root.message}
          </div>
        )}

        <Option label="Shot">
          <Select
            options={controllerOptions}
            name="shot"
            register={register}
          />
          {errors["shot"] && (
            <div style={{ color: "red", fontSize: "0.875rem" }}>
              {errors["shot"]?.message}
            </div>
          )}
        </Option>
        <Option label="Jump">
          <Select
            options={controllerOptions}
            name="jump"
            register={register}
          />
          {errors["jump"] && (
            <div style={{ color: "red", fontSize: "0.875rem" }}>
              {errors["jump"]?.message}
            </div>
          )}
        </Option>
        <Option label="Dash">
          <Select
            options={controllerOptions}
            name="dash"
            register={register}
          />
          {errors["dash"] && (
            <div style={{ color: "red", fontSize: "0.875rem" }}>
              {errors["dash"]?.message}
            </div>
          )}
        </Option>
        <Option label="Item Select">
          <Select
            options={controllerOptions}
            name="itemSelect"
            register={register}
          />
          {errors["itemSelect"] && (
            <div style={{ color: "red", fontSize: "0.875rem" }}>
              {errors["itemSelect"]?.message}
            </div>
          )}
        </Option>
        <Option label="Item Cancel">
          <Select
            options={controllerOptions}
            name="itemCancel"
            register={register}
          />
          {errors["itemCancel"] && (
            <div style={{ color: "red", fontSize: "0.875rem" }}>
              {errors["itemCancel"]?.message}
            </div>
          )}
        </Option>
        <Option label="Angle Up">
          <Select
            options={controllerOptions}
            name="angleUp"
            register={register}
          />
          {errors["angleUp"] && (
            <div style={{ color: "red", fontSize: "0.875rem" }}>
              {errors["angleUp"]?.message}
            </div>
          )}
        </Option>
        <Option label="Angle Down">
          <Select
            options={controllerOptions}
            name="angleDown"
            register={register}
          />
          {errors["angleDown"] && (
            <div style={{ color: "red", fontSize: "0.875rem" }}>
              {errors["angleDown"]?.message}
            </div>
          )}
        </Option>
        <Option>
          <Button
            type="button"
            size="small"
            variant="outline"
            onClick={() => {
              setValue("shot", defaultValues["shot"]);
              setValue("jump", defaultValues["jump"]);
              setValue("dash", defaultValues["dash"]);
              setValue("itemSelect", defaultValues["itemSelect"]);
              setValue("itemCancel", defaultValues["itemCancel"]);
              setValue("angleUp", defaultValues["angleUp"]);
              setValue("angleDown", defaultValues["angleDown"]);
            }}
          >
            Reset buttons to default
          </Button>
        </Option>
      </Section>
    </form>
  );
}
