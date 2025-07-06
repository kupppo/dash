"use client";

import { Section, Option } from "./form-elements";
import Select from "../components/select";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { set } from "idb-keyval";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from './page.module.css';

const defaultValues = {
  moonwalk: false,
  autoCancel: false,
  japanese: false,
};

const gameOptionsSchema = z
  .object({
    moonwalk: z.boolean(),
    autoCancel: z.boolean(),
    japanese: z.boolean(),
  });

export default function ControllerForm() {
  const {
    register,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(gameOptionsSchema),
    defaultValues,
  });

  const watchedValues = watch();

  useEffect(() => {
    const saveLocally = async () => {
      try {
        // Only save if form is valid
        const isValid = await gameOptionsSchema.safeParseAsync(
          watchedValues
        );
        if (isValid.success) {
          await set("game-options", watchedValues);
        }
      } catch (error) {
        console.error("Failed to save controller mapping to IndexedDB:", error);
      }
    };

    saveLocally();
  }, [watchedValues]);

  return (
    <form onSubmit={() => {}} className={styles['secondary-form']}>
      <Section title="Game Options">
        {/* Display global validation error for uniqueness */}
        {errors.root && (
          <div style={{ color: "red", marginBottom: "1rem" }}>
            {errors.root.message}
          </div>
        )}

        <Option label="Moonwalk">
          <Select
            options={[
              { label: "Off", value: false },
              { label: "On", value: true },
            ]}
            name="moonwalk"
            register={register}
          />
          {errors["moonwalk"] && (
            <div style={{ color: "red", fontSize: "0.875rem" }}>
              {errors["moonwalk"]?.message}
            </div>
          )}
        </Option>
        <Option label="Icon Cancel">
          <Select
            options={[
              { label: "Manual", value: false },
              { label: "Auto", value: true },
            ]}
            name="autoCancel"
            register={register}
          />
          {errors["moonwalk"] && (
            <div style={{ color: "red", fontSize: "0.875rem" }}>
              {errors["moonwalk"]?.message}
            </div>
          )}
        </Option>
        <Option label="Language">
          <Select
            options={[
              { label: "English", value: false },
              { label: "Japanese", value: true },
            ]}
            name="japanese"
            register={register}
          />
          {errors["japanese"] && (
            <div style={{ color: "red", fontSize: "0.875rem" }}>
              {errors["japanese"]?.message}
            </div>
          )}
        </Option>
      </Section>
    </form>
  );
}
