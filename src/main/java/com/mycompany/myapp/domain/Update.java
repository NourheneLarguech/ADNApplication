package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mycompany.myapp.domain.enumeration.StatutList;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Update.
 */
@Entity
@Table(name = "update")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Update implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "uid_update", nullable = false, unique = true)
    private String uidUpdate;

    @NotNull
    @Column(name = "version_name", nullable = false, unique = true)
    private String versionName;

    @Enumerated(EnumType.STRING)
    @Column(name = "statut")
    private StatutList statut;

    @Column(name = "description")
    private String description;

    @Column(name = "comment")
    private String comment;

    @ManyToOne
    @JsonIgnoreProperties(value = { "updates", "product" }, allowSetters = true)
    private VersionApplicable versionApplicable;

    @ManyToOne
    @JsonIgnoreProperties(value = { "updates", "product" }, allowSetters = true)
    private VersionCible versionCible;

    @ManyToOne
    @JsonIgnoreProperties(value = { "versionApplicables", "versionCibles", "updates" }, allowSetters = true)
    private Product product;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Update id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUidUpdate() {
        return this.uidUpdate;
    }

    public Update uidUpdate(String uidUpdate) {
        this.setUidUpdate(uidUpdate);
        return this;
    }

    public void setUidUpdate(String uidUpdate) {
        this.uidUpdate = uidUpdate;
    }

    public String getVersionName() {
        return this.versionName;
    }

    public Update versionName(String versionName) {
        this.setVersionName(versionName);
        return this;
    }

    public void setVersionName(String versionName) {
        this.versionName = versionName;
    }

    public StatutList getStatut() {
        return this.statut;
    }

    public Update statut(StatutList statut) {
        this.setStatut(statut);
        return this;
    }

    public void setStatut(StatutList statut) {
        this.statut = statut;
    }

    public String getDescription() {
        return this.description;
    }

    public Update description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getComment() {
        return this.comment;
    }

    public Update comment(String comment) {
        this.setComment(comment);
        return this;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public VersionApplicable getVersionApplicable() {
        return this.versionApplicable;
    }

    public void setVersionApplicable(VersionApplicable versionApplicable) {
        this.versionApplicable = versionApplicable;
    }

    public Update versionApplicable(VersionApplicable versionApplicable) {
        this.setVersionApplicable(versionApplicable);
        return this;
    }

    public VersionCible getVersionCible() {
        return this.versionCible;
    }

    public void setVersionCible(VersionCible versionCible) {
        this.versionCible = versionCible;
    }

    public Update versionCible(VersionCible versionCible) {
        this.setVersionCible(versionCible);
        return this;
    }

    public Product getProduct() {
        return this.product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public Update product(Product product) {
        this.setProduct(product);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Update)) {
            return false;
        }
        return id != null && id.equals(((Update) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Update{" +
            "id=" + getId() +
            ", uidUpdate='" + getUidUpdate() + "'" +
            ", versionName='" + getVersionName() + "'" +
            ", statut='" + getStatut() + "'" +
            ", description='" + getDescription() + "'" +
            ", comment='" + getComment() + "'" +
            "}";
    }
}
